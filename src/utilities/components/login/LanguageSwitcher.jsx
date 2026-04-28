import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the current language object
  const currentLangObj = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false); // Close the menu after selecting
  };

  // Update HTML direction (RTL/LTR)
  useEffect(() => {
    document.documentElement.dir = currentLangObj.dir;
    document.documentElement.lang = currentLangObj.code;
  }, [i18n.language, currentLangObj]);

  return (
    // Added a min-width to keep the button size stable across languages
    <div className="absolute top-4 start-4 z-50 min-w-[130px]" ref={dropdownRef}>
      
      {/* Custom Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-[#444] font-medium cursor-pointer transition-all hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <FaGlobe className="text-[#55BB33]" />
          <span>{currentLangObj.label}</span>
        </div>
        {/* Small custom dropdown arrow */}
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Custom Dropdown List */}
      {isOpen && (
        <ul className="absolute top-full start-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-start px-3 py-2 transition-colors ${
                  i18n.language === lang.code 
                    ? 'bg-[#F8FFF6] text-[#55BB33] font-bold' 
                    : 'text-[#444] hover:bg-gray-100'
                }`}
                dir={lang.dir} // Ensures Arabic text aligns correctly inside the list
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}