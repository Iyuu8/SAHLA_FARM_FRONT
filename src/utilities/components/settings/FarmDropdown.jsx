import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import DynamicTranslator from '../Translation/DynamicTranslator';

export default function FarmDropdown({ label, value, options, onChange, color, isDynamicCrop = false,disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const getDisplayValue = (val) => {
    if (!val) return '';
    const lookupKey = String(val).toLowerCase();

    const translationMap = {
      // modeOptions
      'balanced': 'dashboard.cropInfo.modes.balanced',
      'water saving': 'dashboard.cropInfo.modes.waterSaving',
      'energy saving': 'dashboard.cropInfo.modes.energySaving',
      'growth priority': 'dashboard.cropInfo.modes.growthPriority',
      // manualControlOptions
      'on': 'dashboard.manualModeCard.on',
      'off': 'dashboard.manualModeCard.off',
      // growthStageOptions
      'germination': 'dashboard.cropInfo.stages.germination',
      'seedling': 'dashboard.cropInfo.stages.seedling',
      'vegetative growth': 'dashboard.cropInfo.stages.vegetativeGrowth',
      'flowering': 'dashboard.cropInfo.stages.flowering',
      'fruiting': 'dashboard.cropInfo.stages.fruiting',
      'maturity': 'dashboard.cropInfo.stages.maturity',
    };

    return translationMap[lookupKey] ? t(translationMap[lookupKey]) : val;
  };

  const base = 'max-w-full flex items-center gap-1 px-2 sm:px-3 py-2 rounded-[10px] text-xs sm:text-[1.6ch] font-semibold cursor-pointer select-none';
  return (
    <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={containerRef}>
      <button
        type='button'
        disabled={disabled}
        className={`${base} ${disabled ? 'pointer-events-none' : ''}`}
        style={{ backgroundColor: color.bg, color: color.text }}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>
          {label}: {' '}
          {isDynamicCrop ? (
            <DynamicTranslator text={value} language={currentLang} />
          ) : (
            getDisplayValue(value)
          )}
        </span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: color.text }}>
          <FaCaretDown />
        </span>
      </button>

      {isOpen && (
        <div
          className='absolute start-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border p-1 shadow-[0_8px_22px_rgba(0,0,0,0.18)]'
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
              className='block w-full text-start px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors hover:bg-[rgba(214,247,203,0.5)]'
              onClick={() => {
                if (onChange) onChange(option);
                setIsOpen(false);
              }}
            >
              {isDynamicCrop ? (
                <DynamicTranslator text={option} language={currentLang} />
              ) : (
                getDisplayValue(option)
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}