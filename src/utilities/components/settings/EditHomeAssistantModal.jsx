import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';

export default function EditHomeAssistantModal({
  isOpen,
  onClose,
  initialUrl,
  initialToken,
  onSave,
}) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'online' | 'offline'

  useEffect(() => {
    if (!isOpen) return;
    setUrl(initialUrl || '');
    setToken(initialToken || '');
    setError('');
    setStatus(null);
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

  const handleSave = async () => {
    const trimmedUrl = url.trim();
    const trimmedToken = token.trim();

    if (!trimmedUrl || !trimmedToken) {
      setError(t('profile.editHaModal.errorRequired'));
      return;
    }

    setError('');
    setStatus(null);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/settings/editHaCredentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ haUrl: trimmedUrl, haToken: trimmedToken }),
      });

      const data = await res.json();

      if (res.status === 503) {
        setError('Home Assistant server is unreachable. Check the URL.');
        setStatus('offline');
        return;
      }

      if (res.status === 401) {
        setError(data.error || 'Invalid credentials or token.');
        return;
      }

      if (res.status === 400) {
        setError(data.error || 'Invalid request.');
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Failed to update HA credentials.');
        return;
      }

      // Success
      setStatus(data.status); // 'online' or 'offline'

      if (data.status === 'online') {
        onSave({ url: trimmedUrl, token: trimmedToken, status: data.status });
        onClose();
      } else {
        setError(data.message || 'HA connected but reported offline.');
        onSave({ url: trimmedUrl, token: trimmedToken, status: 'offline' });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4'>
      <div className='w-full max-w-[560px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]'>
        <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>{t('profile.editHaModal.title')}</h3>

        <div className='mt-4 flex flex-col gap-3'>
          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>{t('profile.editHaModal.urlLabel')}</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('profile.editHaModal.urlPlaceholder')}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>{t('profile.editHaModal.tokenLabel')}</span>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t('profile.editHaModal.tokenPlaceholder')}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>
        </div>

        {/* Status indicator */}
        {status && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${status === 'online' ? 'text-[#2E6900]' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-[#2E6900]' : 'bg-red-500'}`} />
            {status === 'online' ? t('profile.connected') : t('profile.offline')}
          </div>
        )}

        {error && <p className='mt-3 text-sm text-[#C73030]'>{error}</p>}

        <div className='mt-5 flex justify-end gap-2'>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            onClick={onClose}
            disabled={loading}
          >
            {t('profile.editHaModal.cancel')}
          </button>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? t('profile.editHaModal.connecting') : t('profile.editHaModal.save')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}