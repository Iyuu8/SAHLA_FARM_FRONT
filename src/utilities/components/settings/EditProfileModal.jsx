import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditProfileModal({
  isOpen,
  onClose,
  initialValues,
  currentPassword,
  onSave,
}) {
  const [formValues, setFormValues] = useState({
    userName: '',
    email: '',
    address: '',
    age: '',
    currentPasswordInput: '',
    newPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormValues({
      userName: initialValues.userName || '',
      email: initialValues.email || '',
      address: initialValues.address || '',
      age: initialValues.age === 0 ? '0' : (initialValues.age ? String(initialValues.age) : ''),
      currentPasswordInput: '',
      newPassword: '',
    });
    setError('');
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (formValues.newPassword) {
      if (!formValues.currentPasswordInput) {
        setError('Enter current password to set a new password.');
        return;
      }
      if (formValues.currentPasswordInput !== currentPassword) {
        setError('Current password is incorrect.');
        return;
      }
    }

    const parsedAge = Number.parseInt(formValues.age, 10);
    if (!Number.isInteger(parsedAge) || parsedAge < 0) {
      setError('Age must be a valid integer.');
      return;
    }

    setError('');
    onSave({
      userName: formValues.userName.trim(),
      email: formValues.email.trim(),
      address: formValues.address.trim(),
      age: parsedAge,
      password: formValues.newPassword ? formValues.newPassword : undefined,
    });
  };

  return createPortal(
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4'>
      <div className='w-full max-w-[540px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]'>
        <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>Edit Profile</h3>

        <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <label className='flex flex-col gap-1 text-sm text-[#192514] sm:col-span-2'>
            <span className='font-semibold'>User Name</span>
            <input
              value={formValues.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514] sm:col-span-2'>
            <span className='font-semibold'>Email</span>
            <input
              type='email'
              value={formValues.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>Address</span>
            <input
              value={formValues.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>Age</span>
            <input
              type='number'
              min='0'
              value={formValues.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>Current Password</span>
            <input
              type='password'
              value={formValues.currentPasswordInput}
              onChange={(e) => handleChange('currentPasswordInput', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
              placeholder='Required to change password'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm text-[#192514]'>
            <span className='font-semibold'>New Password</span>
            <input
              type='password'
              value={formValues.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className='rounded-lg border border-[rgba(23,37,20,0.2)] px-3 py-2 outline-none focus:border-[#57BD36]'
              placeholder='Leave empty to keep current'
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
