import React from 'react';
import { motion } from 'framer-motion';
import { SquarePen } from 'lucide-react';

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type='button'
      onClick={onChange}
      className='relative w-full h-[36px] rounded-full transition-colors bg-[#F8FFF6]'
      aria-label='Toggle manual mode'
      aria-pressed={checked}
    >
      <span
        className={`absolute top-[2px] h-[32px] w-[46px] rounded-full text-[#F8FFF6] flex items-center justify-center text-base leading-none transition-all ${
          checked ? 'left-[2px] bg-[#55BB33]' : 'left-[calc(100%-48px)] bg-[#3A644B]'
        }`}
      >
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

export default function ManualModeCard({
  globalMode,
  onToggleGlobalMode,
  onOpenEdit,
}) {
  const isSemiAuto = globalMode === 'semi-auto';

  return (
    <motion.div
      className='w-[150px] sm:w-[160px] md:w-[176px] h-[110px] rounded-[25px] bg-[#192514] p-4 sm:p-5 text-[#F8FFF6] shadow-[0_4px_12px_rgba(0,0,0,0.25)]'
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
    >
      <div className='w-full max-w-[132px] sm:max-w-[138px] md:max-w-[146px]'>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-[0.98rem] sm:text-[1.05rem] leading-none capitalize'>{globalMode}</span>
          <motion.button
            type='button'
            onClick={onOpenEdit}
            className='text-[#F8FFF6] hover:opacity-85 transition-opacity'
            aria-label='Edit actuator modes'
            whileTap={{ scale: 0.92 }}
          >
            <SquarePen size={19} />
          </motion.button>
        </div>

        <div className='mt-3.5'>
          <ToggleSwitch
            checked={isSemiAuto}
            onChange={() => onToggleGlobalMode(!isSemiAuto)}
          />
        </div>
      </div>
    </motion.div>
  );
}
