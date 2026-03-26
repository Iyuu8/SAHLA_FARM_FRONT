import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';

export default function FarmDropdown({ label, value, options, onChange, color }) {
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

  const base = 'max-w-full flex items-center gap-1 px-2 sm:px-3 py-2 rounded-[10px] text-xs sm:text-[1.6ch] font-semibold cursor-pointer select-none';

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        className={base}
        style={{ backgroundColor: color.bg, color: color.text }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>{label}: {value}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: color.text }}><FaCaretDown /></span>
      </button>

      {isOpen && (
        <div
          className='absolute left-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border p-1 shadow-[0_8px_22px_rgba(0,0,0,0.18)]'
          style={{
            backgroundColor: color.bg === '#192514' ? '#1F2D19' : '#F0FFE9',
            color: color.bg === '#192514' ? '#F8FFF6' : '#192514',
            borderColor: color.bg === '#192514' ? 'rgba(248,255,246,0.15)' : 'rgba(23,37,20,0.15)',
          }}
        >
          {(options || []).map((option) => (
            <button
              key={option}
              type='button'
              className='block w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors hover:bg-[rgba(214,247,203,0.5)]'
              onClick={() => {
                if (onChange) onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
