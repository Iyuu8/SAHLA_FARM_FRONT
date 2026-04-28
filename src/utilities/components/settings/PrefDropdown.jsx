import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';

export default function PrefDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const normalizedOptions = (options || []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option
  );

  const base = 'max-w-full flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-[1.5ch] font-semibold cursor-pointer select-none bg-[#DEDEDE] text-[#192514]';

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        className={base}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>{label}: {value}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><FaCaretDown /></span>
      </button>

      {isOpen && (
        <div className='absolute start-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border border-[rgba(23,37,20,0.15)] bg-[#F4F6F4] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.14)]'>
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type='button'
              className='block w-full text-start px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors text-[#192514] hover:bg-[#DEDEDE]'
              onClick={() => {
                if (onChange) onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
