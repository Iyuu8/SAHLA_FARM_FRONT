import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

/**
 * CropInfoDropdown
 *
 * Props:
 *  value        — currently selected string
 *  options      — string[]
 *  onChange     — (value: string) => void
 *  placeholder  — string shown when nothing is selected
 */
export default function CropInfoDropdown({ value, options = [], onChange, placeholder = 'Select' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 focus:outline-none group"
      >
        <span
          className="text-sm font-semibold leading-none"
          style={{ color: 'rgba(248,255,246,1)' }}
        >
          {value || placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} color="rgba(248,255,246,0.85)" strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              transformOrigin: 'top center',
              // Two-layer background as specified
              background:
                'linear-gradient(315deg, rgba(189,214,48,0.02) 0%, rgba(173,210,48,0.02) 100%), linear-gradient(135deg, rgba(34,78,0,0.70) 0%, rgba(40,61,20,0.70) 100%)',
              // Stroke
              border: '1px solid rgba(214,247,203,0.08)',
              // Box shadow
              boxShadow: '4px 4px 10px 0px rgba(0,0,0,0.35)',
              // Backdrop blur
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              borderRadius: 0,
            }}
            className="absolute left-0 top-full mt-1 z-50 min-w-[160px] py-1 overflow-hidden"
          >
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full flex items-center justify-between px-3 py-[7px] text-left transition-colors"
                  style={{
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
                  <span className="capitalize">{option}</span>
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