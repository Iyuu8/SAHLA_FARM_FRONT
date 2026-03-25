import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditHomeAssistantModal({
  isOpen,
  onClose,
  initialUrl,
  initialToken,
  onSave,
}) {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setUrl(initialUrl || '');
    setToken(initialToken || '');
    setError('');
  }, [isOpen, initialUrl, initialToken]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedUrl = url.trim();
    const trimmedToken = token.trim();

    if (!trimmedUrl || !trimmedToken) {
      setError('URL and token are required.');
      return;
    }

    setError('');
    onSave({ url: trimmedUrl, token: trimmedToken });
  };

  return createPortal(
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4'>
      <div className='w-full max-w-[560px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]'>
        <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>Change Home Assistant Connection</h3>

        <div className='mt-4 flex flex-col gap-3'>
          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>Home Assistant URL</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='http://sahla-homeassistant.local:8123'
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>Long-Lived Access Token</span>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder='Enter access token'
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>
        </div>

        {error ? <p className='mt-3 text-sm text-[#C73030]'>{error}</p> : null}

        <div className='mt-5 flex justify-end gap-2'>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
