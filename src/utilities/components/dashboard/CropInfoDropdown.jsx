import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DynamicTranslator from '../Translation/DynamicTranslator';

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
  const { t , i18n} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(value || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const selectedVal = ()=>{
    return <DynamicTranslator text={value} language={i18n.language} />
  }
  // Fallback placeholder in case the parent doesn't provide one
  const safePlaceholder = placeholder || t('dashboard.cropInfo.selectStage', 'Select');

  // Keep input text in sync when parent changes value
  useEffect(() => {
    setInputVal(value || '');
  }, [value]);

  // Close on outside click; also reset input if crop field
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
        onAddOption?.(trimmed); // add to shared list
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

      {/* ── Value display: text input for crop, button for others ── */}
      {isCropInput ? (
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          placeholder={safePlaceholder}
          onChange={(e) => {
            setInputVal(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          dir="auto" /* <-- Added: Helps browser detect RTL vs LTR typed text */
          className="bg-transparent border-none outline-none text-sm font-semibold leading-none w-24 placeholder:text-white/40"
          style={{ color: 'rgba(248,255,246,1)' }}
          autoComplete="off"
          spellCheck={false}
        />
        
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-0.5 focus:outline-none"
        >
          <span className="text-sm font-semibold leading-none" style={{ color: 'rgba(248,255,246,1)' }}>
            {value
      ? selectedVal()
      : safePlaceholder}
          </span>
        </button>
      )}

      {/* Caret — always toggles the dropdown */}
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
            // Changed left-0 to start-0 so the dropdown anchors correctly in Arabic (RTL)
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
                  // Changed text-left to text-start for RTL support
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
                  <span className="capitalize"><DynamicTranslator text={option} language={i18n.language} /></span>
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