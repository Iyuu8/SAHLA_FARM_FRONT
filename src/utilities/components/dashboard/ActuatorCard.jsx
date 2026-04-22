import React from 'react';
import { Fan } from 'lucide-react';

function ActuatorIcon({ name }) {
  if (name.toLowerCase() === 'pump') {
    return (
      <img
        src='/pump.svg'
        alt='Pump'
        className='w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] md:w-[56px] md:h-[56px] object-contain'
      />
    );
  }

  return <Fan size={44} className='sm:w-[48px] sm:h-[48px] md:w-[52px] md:h-[52px]' color='#F8FFF6' strokeWidth={2.2} />;
}

export default function ActuatorCard({
  name,
  status,
  mode,
  schedule,
  onToggle,
}) {
  const isOn = status === 'on';
  const isSemiAuto = mode === 'semi-auto';

  const handleClick = () => {
    if (!isSemiAuto) return;
    onToggle?.();
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`relative overflow-hidden w-full md:w-[240px] h-[110px] rounded-[25px] p-3.5 sm:p-4 text-left text-[#F8FFF6] shadow-[0_4px_12px_rgba(0,0,0,0.25)] font-normal ${
        isSemiAuto ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
      }`}
    >
      <span
        className={`absolute inset-0 transition-opacity duration-300 ease-out ${
          isOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'linear-gradient(330deg, #2E6900 0%, #5ACF00 100%)' }}
      />
      <span
        className={`absolute inset-0 bg-[#192514] transition-opacity duration-300 ease-out ${
          isOn ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div className='relative z-10 h-full w-full flex items-center gap-2.5 sm:gap-3.5'>
        <div className='shrink-0'>
          <ActuatorIcon name={name} />
        </div>

        <div className='min-w-0 font-normal'>
          
          <p className='text-[1.54ch] sm:text-[1.68ch] leading-5 mt-1 font-normal'>
            {schedule}
          </p>
        </div>
      </div>
    </button>
  );
}
