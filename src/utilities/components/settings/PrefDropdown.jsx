import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

export default function PrefDropdown({ label, value, options, onChange,disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const supportedLanguages = [
      { code: 'ar', label: 'العربية' },
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' }
    ];
  function getLanguageLabel(code) {
    return supportedLanguages.find((lang) => lang.code === code)?.label || code;
  }

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const getDisplayValue = (option) => {
    // 1. If it's a string (like 'English' or 'العربية'), return it exactly as is
    if (typeof option === 'string') {
      if (option.toLowerCase() === 'english' || option.toLowerCase() === 'en') {
        return 'English';
      } else if (option.toLowerCase() === 'arabic' || option.toLowerCase() === 'ar' || option === 'العربية') {
        return 'العربية';
      } else if (option.toLowerCase() === 'french' || option.toLowerCase() === 'fr' || option === 'franc') {
        return 'Français';
      }
      return option;
    }

    // 2. If it's a language code, map it to the full language name
    if (option && typeof option === 'string' && ['en', 'ar', 'fr'].includes(option.toLowerCase())) {
      return getLanguageLabel(option);
    }

    // 2. If it's a unit object, map the internal value to the translation
    if (option && typeof option === 'object') {
      const lookupKey = String(option.value).toLowerCase();

      const translationMap = {
        '°c': 'profile.options.units.celsius',
        '°f': 'profile.options.units.fahrenheit',
        'k': 'profile.options.units.kelvin',
        '%': 'profile.options.units.humidityPct',
        'g/m³': 'profile.options.units.absHumidity',
        'lux': 'profile.options.units.lux',
        'fc': 'profile.options.units.footCandle',
        'lm': 'profile.options.units.lumen',
      };

      return translationMap[lookupKey] ? t(translationMap[lookupKey]) : option.label;
    }

    return option;
  };

  const base = 'max-w-full flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-[1.5ch] font-semibold cursor-pointer select-none bg-[#DEDEDE] text-[#192514]';

  return (
    <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={containerRef}>
      <button
        type='button'
        disabled={disabled}
        className={`${base} ${disabled ? 'pointer-events-none' : ''}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>{label}: {getDisplayValue(value)}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><FaCaretDown /></span>
      </button>

      {isOpen && (
        <div className='absolute start-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border border-[rgba(23,37,20,0.15)] bg-[#F4F6F4] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.14)]'>
          {(options || []).map((option, index) => {
            // Determine the value to send to the parent (the code or the language name)
            const optValue = typeof option === 'object' ? option.value : option;
            
            return (
              <button
                key={index}
                type='button'
                className='block w-full text-start px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors text-[#192514] hover:bg-[#DEDEDE]'
                onClick={() => {
                  if (onChange) onChange(optValue);
                  setIsOpen(false);
                }}
              >
                {/* Renders string directly OR translated unit label */}
                {getDisplayValue(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}