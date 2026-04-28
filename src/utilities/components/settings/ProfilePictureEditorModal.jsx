import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export default function ProfilePictureEditorModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Update preview canvas when image or scale changes
  useEffect(() => {
    if (!imageUrl || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scaledSize = size / scale;
      const x = (img.width - scaledSize) / 2;
      const y = (img.height - scaledSize) / 2;

      ctx.drawImage(img, x, y, scaledSize, scaledSize, 0, 0, size, size);

      // Draw circle overlay
      ctx.strokeStyle = '#57BD36';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.stroke();
    };
    img.src = imageUrl;
  }, [imageUrl, scale]);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result || '');
      setScale(1);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndConfirm = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    try {
      setLoading(true);
      const img = new Image();
      img.onload = async () => {
        try {
          const baseSize = Math.min(img.width, img.height);
          const scaledSize = baseSize / scale;
          const x = (img.width - scaledSize) / 2;
          const y = (img.height - scaledSize) / 2;

          canvas.width = baseSize;
          canvas.height = baseSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, x, y, scaledSize, scaledSize, 0, 0, baseSize, baseSize);
          const croppedUrl = canvas.toDataURL('image/png');
          
          await onConfirm(croppedUrl);
          setImageUrl('');
          setScale(1);
          setError('');
        } catch (err) {
          setError('Failed to upload image');
        } finally {
          setLoading(false);
        }
      };
      img.src = imageUrl;
    } catch (err) {
      setError('Failed to process image');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImageUrl('');
    setScale(1);
    setError('');
    onClose();
  };

  return createPortal(
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4'>
      <div className='w-full max-w-[540px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]'>
        <h3 className='text-lg sm:text-xl font-bold text-[#192514] mb-4'>{t('profile.pfpEditorModal.title') || 'Edit Profile Picture'}</h3>

        {!imageUrl ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='w-32 h-32 border-2 border-dashed border-[#57BD36] rounded-lg flex items-center justify-center'>
              <span className='text-sm text-[rgba(25,37,20,0.5)]'>No image selected</span>
            </div>
            <input
              ref={inputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='px-4 py-2 bg-[#57BD36] text-white rounded-lg font-semibold hover:bg-[#4ea531] transition-colors'
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='flex justify-center'>
              <canvas
                ref={previewCanvasRef}
                alt='Preview'
                className='max-w-full max-h-64 rounded-lg border-2 border-[#57BD36]'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-[#192514]'>
                Scale
              </label>
              <input
                type='range'
                min='0.5'
                max='2'
                step='0.1'
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className='w-full'
              />
            </div>
            <button
              type='button'
              onClick={() => {
                setImageUrl('');
                setScale(1);
              }}
              className='px-4 py-2 bg-[#E8ECE7] text-[#192514] rounded-lg font-semibold hover:bg-[#DDE3DC] transition-colors'
            >
              Choose Different Image
            </button>
          </div>
        )}

        {error && <p className='mt-3 text-sm text-[#C73030]'>{error}</p>}

        <canvas ref={canvasRef} className='hidden' />

        <div className='mt-5 flex justify-end gap-2'>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            onClick={handleClose}
            disabled={loading}
          >
            {t('profile.editProfileModal.cancel') || 'Cancel'}
          </button>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleCropAndConfirm}
            disabled={!imageUrl || loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}