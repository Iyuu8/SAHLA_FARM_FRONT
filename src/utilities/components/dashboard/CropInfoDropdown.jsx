import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DynamicTranslator from '../Translation/DynamicTranslator'; // <-- Adjust this path to wherever you saved it

/**
 * CropInfoDropdown
 *
 * Props:
 * value        — currently selected string
 * options      — string[]
 * onChange     — (value: string) => void
 * onAddOption  — (value: string) => void   (only needed for crop field)
 * placeholder  — fallback display text
 * isCropInput  — boolean: renders a text input instead of a plain button label
 */
export default function CropInfoDropdown({
  value,
  options = [],
  onChange,
  onAddOption,
  placeholder,
  isCropInput = false,
}) {
  // Grab i18n to get the current language for the DynamicTranslator
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en'; 

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(value || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const safePlaceholder = placeholder || t('dashboard.cropInfo.selectStage', 'Select');

  const getDisplayValue = (val) => {
    if (!val) return '';
    const translationMap = {
      'Germination': 'dashboard.cropInfo.stages.germination',
      'Seedling': 'dashboard.cropInfo.stages.seedling',
      'Vegetative': 'dashboard.cropInfo.stages.vegetative',
      'Flowering': 'dashboard.cropInfo.stages.flowering',
      'Fruiting': 'dashboard.cropInfo.stages.fruiting',
      'Maturity': 'dashboard.cropInfo.stages.maturity',
      'Balanced': 'dashboard.cropInfo.modes.balanced',
      'Water saving': 'dashboard.cropInfo.modes.waterSaving',
      'Energy saving': 'dashboard.cropInfo.modes.energySaving',
      'Growth priority': 'dashboard.cropInfo.modes.growthPriority',
    };
    return translationMap[val] ? t(translationMap[val]) : val;
  };

  useEffect(() => {
    setInputVal(value || '');
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (isCropInput) setInputVal(value || '');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value, isCropInput]);

  // Focus the input automatically if the menu is opened by clicking the text
  useEffect(() => {
    if (isOpen && isCropInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isCropInput]);

  const handleSelect = (option) => {
    onChange?.(option);
    if (isCropInput) setInputVal(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (!trimmed) return;
      const match = options.find((o) => o.toLowerCase() === trimmed.toLowerCase());
      if (match) {
        onChange?.(match);
        setInputVal(match);
      } else {
        onAddOption?.(trimmed); 
        onChange?.(trimmed);
        setInputVal(trimmed);
      }
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputVal(value || '');
      inputRef.current?.blur();
    }
  };

  const dropdownStyle = {
    background:
      'linear-gradient(315deg, rgba(189,214,48,0.02) 0%, rgba(173,210,48,0.02) 100%), linear-gradient(135deg, rgba(34,78,0,0.70) 0%, rgba(40,61,20,0.70) 100%)',
    border: '1px solid rgba(214,247,203,0.08)',
    boxShadow: '4px 4px 10px 0px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    borderRadius: 0,
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1">

      {/* ── Value display ── */}
      {isCropInput ? (
        isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            placeholder={safePlaceholder}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="auto" 
            className="bg-transparent border-none outline-none text-sm font-semibold leading-none w-24 placeholder:text-white/40"
            style={{ color: 'rgba(248,255,246,1)' }}
            autoComplete="off"
            spellCheck={false}
          />
        ) : (
          // Tooltip only wraps the crop value, not the caret
          <div className="relative group">
            <div 
              className="text-sm font-semibold leading-none w-24 cursor-text flex items-center"
              style={{ color: 'rgba(248,255,246,1)', minHeight: '14px' }}
              onClick={() => setIsOpen(true)}
            >
              {value ? (
                <DynamicTranslator text={value} language={currentLang} />
              ) : (
                <span className="text-white/40">{safePlaceholder}</span>
              )}
            </div>

            {/* Tooltip — only visible on hover of the crop value */}
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
              style={{
                background: 'rgba(20, 40, 15, 0.96)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
                {t('dashboard.cropInfo.addCropHover', 'Click here to add new crop')}
              <span
                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                style={{ borderTopColor: 'rgba(20, 40, 15, 0.96)' }}
              />
            </span>
          </div>
        )
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-0.5 focus:outline-none"
        >
          <span className="text-sm font-semibold leading-none" style={{ color: 'rgba(248,255,246,1)' }}>
            {value ? getDisplayValue(value) : safePlaceholder}
          </span>
        </button>
      )}

      {/* Caret — separate, no tooltip */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus:outline-none flex items-center"
        tabIndex={-1}
      >
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color="rgba(248,255,246,0.85)" strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ transformOrigin: 'top center', ...dropdownStyle }}
            className="absolute start-0 top-full mt-1 z-50 min-w-[160px] overflow-hidden"
          >
            {options.map((option, idx) => {
              const isSelected = option.toLowerCase() === (value || '').toLowerCase();
              const isFirst = idx === 0;
              const isLast = idx === options.length - 1;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full flex items-center justify-between px-3 text-start transition-colors"
                  style={{
                    paddingTop: isFirst ? '9px' : '6px',
                    paddingBottom: isLast ? '9px' : '6px',
                    background: isSelected ? 'rgba(85,187,51,0.15)' : 'transparent',
                    color: 'rgba(248,255,246,0.80)',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(85,187,51,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="capitalize">
                    {isCropInput ? (
                      <DynamicTranslator text={option} language={currentLang} />
                    ) : (
                      getDisplayValue(option)
                    )}
                  </span>
                  {isSelected && (
                    <Check size={13} color="rgba(248,255,246,0.80)" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}