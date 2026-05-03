import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const VIEWPORT_SIZE = 280;
const FRAME_DIAMETER = 200;
const FRAME_RADIUS = FRAME_DIAMETER / 2;
const OUTPUT_SIZE = 320;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ProfilePictureEditorModal({ isOpen, onClose, onConfirm }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const imageRef = useRef(null);

  const [imageUrl, setImageUrl] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // from doc 12

  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setImageUrl('');
      setImageSize({ width: 0, height: 0 });
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setIsDragging(false);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!imageUrl) return undefined;
    const nextImage = new Image();
    nextImage.onload = () => {
      setImageSize({ width: nextImage.naturalWidth, height: nextImage.naturalHeight });
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setError('');
    };
    nextImage.onerror = () => {
      setError(t('profile.pfpEditorModal.errorLoad'));
      setImageUrl('');
    };
    nextImage.src = imageUrl;
    return () => { nextImage.onload = null; nextImage.onerror = null; };
  }, [imageUrl, t]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseMove = (event) => {
      if (!isDragging || !imageSize.width || !imageSize.height) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      setOffset(clampOffset(dragRef.current.initialX + dx, dragRef.current.initialY + dy, imageSize, zoom));
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, imageSize, isOpen, zoom]);

  const baseScale = useMemo(() => {
    if (!imageSize.width || !imageSize.height) return 1;
    return Math.max(FRAME_DIAMETER / imageSize.width, FRAME_DIAMETER / imageSize.height);
  }, [imageSize]);

  const effectiveScale = baseScale * zoom;

  const selectImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('profile.pfpEditorModal.errorFileType'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // from doc 12
      setError('Image size must be less than 5MB');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImageUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  useEffect(() => {
    return () => { if (imageUrl && imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl]);

  const handleDrop = (e) => { e.preventDefault(); selectImageFile(e.dataTransfer?.files?.[0]); };
  const handleDragOver = (e) => e.preventDefault();
  const handleFileChange = (e) => { selectImageFile(e.target.files?.[0]); e.target.value = ''; };

  const startDrag = (clientX, clientY) => {
    dragRef.current = { startX: clientX, startY: clientY, initialX: offset.x, initialY: offset.y };
    setIsDragging(true);
  };

  const handleMouseDown = (e) => { if (!imageUrl) return; e.preventDefault(); startDrag(e.clientX, e.clientY); };
  const handleTouchStart = (e) => { if (!imageUrl) return; const touch = e.touches?.[0]; if (touch) startDrag(touch.clientX, touch.clientY); };
  const handleTouchMove = (e) => {
    if (!isDragging || !imageSize.width || !imageSize.height) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    setOffset(clampOffset(dragRef.current.initialX + touch.clientX - dragRef.current.startX, dragRef.current.initialY + touch.clientY - dragRef.current.startY, imageSize, zoom));
  };
  const handleTouchEnd = () => setIsDragging(false);

  const handleZoomChange = (e) => {
    const nextZoom = Number(e.target.value);
    setZoom(nextZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, imageSize, nextZoom));
  };

  // from doc 12: loading state + try/catch around onConfirm
  const handleConfirm = async () => {
    if (!imageRef.current || !imageSize.width || !imageSize.height) {
      setError(t('profile.pfpEditorModal.errorNoImage'));
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setError(t('profile.pfpEditorModal.errorProcess')); return; }

    const sourceRadius = FRAME_RADIUS / effectiveScale;
    const centerX = imageSize.width / 2 - offset.x / effectiveScale;
    const centerY = imageSize.height / 2 - offset.y / effectiveScale;
    const sourceSize = sourceRadius * 2;
    const sourceX = clamp(centerX - sourceRadius, 0, imageSize.width - sourceSize);
    const sourceY = clamp(centerY - sourceRadius, 0, imageSize.height - sourceSize);

    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imageRef.current, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.restore();

    try {
      setLoading(true);
      await onConfirm(canvas.toDataURL('image/png'));
      onClose();
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // from doc 12: explicit reset on close
  const handleClose = () => {
    setImageUrl('');
    setZoom(1);
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4 font-newblack'>
      <div className='w-full max-w-[620px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]'>
        <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>{t('profile.pfpEditorModal.title')}</h3>

        {!imageUrl ? (
          <div
            className='mt-4 rounded-xl border-2 border-dashed border-[rgba(23,37,20,0.3)] bg-[#F5F7F6] p-6 sm:p-8 text-center'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className='text-sm sm:text-base text-[#192514] font-semibold'>{t('profile.pfpEditorModal.dropImage')}</p>
            <p className='text-xs sm:text-sm text-[rgba(25,37,20,0.65)] mt-1'>{t('profile.pfpEditorModal.or')}</p>
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors'
            >
              {t('profile.pfpEditorModal.browse')}
            </button>
            <input ref={inputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
          </div>
        ) : (
          <div className='mt-4 flex flex-col gap-4'>
            <div className='mx-auto'>
              <div
                className='relative overflow-hidden rounded-2xl bg-[#E8ECE7] select-none'
                style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt='Profile crop preview'
                  draggable={false}
                  className='absolute top-1/2 left-1/2 max-w-none'
                  style={{
                    width: imageSize.width,
                    height: imageSize.height,
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${effectiveScale})`,
                    transformOrigin: 'center center',
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                />
                <div className='pointer-events-none absolute inset-0'>
                  <div
                    className='absolute border-[3px] border-[#57BD36] rounded-full shadow-[0_0_0_9999px_rgba(25,37,20,0.45)]'
                    style={{
                      width: FRAME_DIAMETER,
                      height: FRAME_DIAMETER,
                      left: (VIEWPORT_SIZE - FRAME_DIAMETER) / 2,
                      top: (VIEWPORT_SIZE - FRAME_DIAMETER) / 2,
                    }}
                  />
                </div>
              </div>
            </div>

            <label className='flex flex-col gap-1 text-sm text-[#192514]'>
              <span className='font-semibold'>{t('profile.pfpEditorModal.zoom')}</span>
              <input type='range' min='1' max='3' step='0.01' value={zoom} onChange={handleZoomChange} className='accent-[#57BD36]' />
            </label>

            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='w-fit rounded-lg px-3 py-1.5 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            >
              {t('profile.pfpEditorModal.chooseAnother')}
            </button>
            <input ref={inputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
          </div>
        )}

        {error && <p className='mt-3 text-sm text-[#C73030]'>{error}</p>}

        <div className='mt-5 flex justify-end gap-2'>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            onClick={handleClose}
            disabled={loading}
          >
            {t('profile.pfpEditorModal.cancel')}
          </button>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleConfirm}
            disabled={!imageUrl || loading}
          >
            {loading ? t('profile.pfpEditorModal.saving') : t('profile.pfpEditorModal.confirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function clampOffset(nextX, nextY, imageSize, zoom) {
  if (!imageSize.width || !imageSize.height) return { x: 0, y: 0 };
  const baseScale = Math.max(FRAME_DIAMETER / imageSize.width, FRAME_DIAMETER / imageSize.height);
  const effectiveScale = baseScale * zoom;
  const maxX = Math.max(0, (imageSize.width * effectiveScale) / 2 - FRAME_RADIUS);
  const maxY = Math.max(0, (imageSize.height * effectiveScale) / 2 - FRAME_RADIUS);
  return { x: clamp(nextX, -maxX, maxX), y: clamp(nextY, -maxY, maxY) };
}