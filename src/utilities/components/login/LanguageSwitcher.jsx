import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LANGUAGES = [
  { code: 'en', label: 'English',  shortLabel: 'en', dir: 'ltr' },
  { code: 'fr', label: 'Français', shortLabel: 'fr', dir: 'ltr' },
  { code: 'ar', label: 'العربية',  shortLabel: 'عر', dir: 'rtl' },
];

/**
 * LanguageSwitcher
 *
 * Props:
 *  compact   – when true, shows only the short label (en / fr / عر) and hides the chevron.
 *              Renders inline (position: relative) instead of absolutely positioned.
 *  className – extra classes merged onto the wrapper div.
 */
export default function LanguageSwitcher({ compact = false, className = '' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Keep <html> dir/lang in sync
  useEffect(() => {
    document.documentElement.dir  = currentLangObj.dir;
    document.documentElement.lang = currentLangObj.code;
  }, [i18n.language, currentLangObj]);

  // Wrapper positioning:
  //  - login pages (compact=false): absolute top-left, fixed width
  //  - landing / help nav (compact=true): relative, shrink-to-content
  const wrapperClass = compact
    ? `relative z-50 ${className}`
    : `absolute top-4 start-4 z-50 min-w-[130px] ${className}`;

  return (
    <div className={wrapperClass} ref={dropdownRef}>

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-[#444] font-medium cursor-pointer transition-all hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <FaGlobe className="text-[#55BB33]" />
          <span>{compact ? currentLangObj.shortLabel : currentLangObj.label}</span>
        </div>

        {/* Chevron — only in full (non-compact) mode */}
        {!compact && (
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul className="absolute top-full mt-1 w-max min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 start-0">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-start px-3 py-2 transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-[#F8FFF6] text-[#55BB33] font-bold'
                    : 'text-[#444] hover:bg-gray-100'
                }`}
                dir={lang.dir}
              >
                {compact ? lang.shortLabel : lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}