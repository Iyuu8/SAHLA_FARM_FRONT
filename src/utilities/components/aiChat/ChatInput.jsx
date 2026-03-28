import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, ChevronDown, FileText, Image as ImageIcon, X } from 'lucide-react';

/**
 * ChatInput — the fixed bottom input bar.
 *
 * Props:
 *   onSend        (text: string, files: File[]) => void
 *   isThinking    boolean
 *   responseMode  'Detailed' | 'Concise'
 *   setResponseMode fn
 */
export default function ChatInput({ onSend, isThinking, responseMode, setResponseMode }) {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const modeMenuRef = useRef(null);

  // Close mode menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target)) {
        setShowModeMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canSend = !isThinking && (input.trim().length > 0 || attachedFiles.length > 0);

  const handleSend = () => {
    if (!canSend) return;
    onSend(input.trim(), [...attachedFiles]);
    setInput('');
    setAttachedFiles([]);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (idx) => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
  };

  return (
    <div className="shrink-0 px-3 sm:px-6 md:px-12 lg:px-20 pb-4 pt-2">

      {/* File chips preview */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {attachedFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-white border border-[rgba(25,37,20,0.12)] rounded-lg px-2.5 py-1 text-sm text-[#192514] font-medium"
              >
                {f.type?.startsWith('image/')
                  ? <ImageIcon size={13} className="text-[#55BB33]" />
                  : <FileText size={13} className="text-[#55BB33]" />}
                <span className="truncate max-w-[140px]">{f.name}</span>
                <button
                  onClick={() => removeFile(i)}
                  className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input row */}
      <div
        className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2"
        style={{
          border: '1.5px solid rgba(85,187,51,0.45)',
          boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.06)',
        }}
      >
        {/* Attach */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors hover:brightness-90"
          style={{ background: '#55BB33' }}
          title="Attach file or image"
        >
          <Plus size={17} color="#F8FFF6" strokeWidth={2.5} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.csv,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your farm ..."
          className="flex-1 resize-none bg-transparent outline-none text-base text-[#192514] placeholder:text-[#192514]/35 leading-relaxed py-1 max-h-[130px] overflow-y-auto font-newblack"
        />

        {/* Response mode selector */}
        <div ref={modeMenuRef} className="relative shrink-0">
          <button
            onClick={() => setShowModeMenu((p) => !p)}
            className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hover:brightness-90"
            style={{ background: '#55BB33', color: '#F8FFF6' }}
          >
            {responseMode}
            <ChevronDown size={13} strokeWidth={2.5} />
          </button>

          <AnimatePresence>
            {showModeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.14 }}
                className="absolute bottom-full right-0 mb-1 bg-white rounded-xl overflow-hidden z-50"
                style={{
                  border: '1px solid rgba(25,37,20,0.10)',
                  boxShadow: '0px 8px 20px rgba(0,0,0,0.12)',
                  minWidth: '110px',
                }}
              >
                {['Detailed', 'Concise'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setResponseMode(opt); setShowModeMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      color: responseMode === opt ? '#55BB33' : '#192514',
                      background: responseMode === opt ? 'rgba(85,187,51,0.08)' : 'transparent',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-35"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(85,187,51,0.55)',
            color: '#55BB33',
          }}
        >
          <Send size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}