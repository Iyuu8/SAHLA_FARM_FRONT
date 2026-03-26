import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

function ToggleSwitch({ checked, onToggle }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={`relative w-[92px] h-[34px] rounded-full transition-colors ${
        checked ? 'bg-[#DFE8DD]' : 'bg-[#294231]'
      }`}
      aria-label='Toggle actuator mode'
      aria-pressed={checked}
    >
      <span
        className={`absolute top-[2px] h-[30px] w-[42px] rounded-full text-[#F8FFF6] flex items-center justify-center text-lg leading-none transition-all ${
          checked ? 'left-[2px] bg-[#55BB33]' : 'left-[48px] bg-[#3D674C]'
        }`}
      >
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

export default function EditActuatorsModal({
  isOpen,
  onClose,
  actuators,
  onToggleActuatorMode,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className='w-full max-w-[540px] rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)] font-newblack'
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-lg sm:text-xl text-[#192514]'>Edit Actuator Modes</h3>
          <button
            type='button'
            onClick={onClose}
            className='text-[#192514] hover:opacity-75 transition-opacity'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>
        </div>

        <p className='text-sm text-[rgba(25,37,20,0.62)] mt-2'>
          Toggle each actuator: ON means semi-auto, OFF means auto.
        </p>

        <div className='mt-4 flex flex-col gap-3'>
          {actuators.map((actuator) => {
            const isSemiAuto = actuator.mode === 'semi-auto';
            return (
              <motion.div
                key={actuator.id}
                className='rounded-lg border border-[rgba(25,37,20,0.16)] px-4 py-3 flex items-center justify-between'
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className='text-base text-[#192514]'>{actuator.name}</p>
                  <p className='text-sm text-[rgba(25,37,20,0.62)] capitalize'>
                    {actuator.mode}
                  </p>
                </div>

                <ToggleSwitch
                  checked={isSemiAuto}
                  onToggle={() => onToggleActuatorMode(actuator.id)}
                />
              </motion.div>
            );
          })}
        </div>

        <div className='mt-5 flex justify-end'>
          <button
            type='button'
            className='rounded-lg px-4 py-2 text-sm text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
