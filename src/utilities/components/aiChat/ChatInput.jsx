// src/utilities/components/aiChat/ChatInput.jsx

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, ChevronDown, FileText, Image as ImageIcon, X, SquarePen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ChatInput — the fixed bottom input bar.
 *
 * Props:
 *   onSend           (text: string, files: File[]) => void
 *   onNewChat        () => void   — clears conversation
 *   isThinking       boolean
 *   responseMode     'Detailed' | 'Concise'
 *   setResponseMode  fn
 *   hasMessages      boolean     — shows new chat button only when there are messages
 */
export default function ChatInput({ onSend, onNewChat, isThinking, responseMode, setResponseMode, hasMessages }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef  = useRef(null);
  const modeMenuRef  = useRef(null);
  const dragCounterRef = useRef(0); // tracks nested drag enter/leave events

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
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = (e) => {
    setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    e.target.value = '';
  };

  const removeFile = (idx) => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
  };

  // ─── Paste handler ───────────────────────────────────────────────────────
  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItems = items.filter((item) => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;
    e.preventDefault();
    const files = imageItems.map((item) => item.getAsFile()).filter(Boolean);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files]);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Drag-and-drop handlers ───────────────────────────────────────────────
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDraggingOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...droppedFiles]);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="shrink-0 px-2 sm:px-6 md:px-12 lg:px-20 pb-3 sm:pb-4 pt-2">

      {/* File chips */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white border border-[rgba(25,37,20,0.12)] rounded-lg px-2 py-1 text-xs sm:text-sm text-[#192514] font-medium">
                {f.type?.startsWith('image/')
                  ? <ImageIcon size={13} className="text-[#55BB33]" />
                  : <FileText  size={13} className="text-[#55BB33]" />}
                <span className="truncate max-w-[120px] sm:max-w-[180px]">{f.name}</span>
                <button onClick={() => removeFile(i)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input card — drag-and-drop target */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className="relative bg-white rounded-2xl px-2.5 sm:px-3 py-2 transition-all duration-200"
        style={{
          border: isDraggingOver
            ? '1.5px dashed #55BB33'
            : '1.5px solid rgba(85,187,51,0.45)',
          boxShadow: isDraggingOver
            ? '0px 0px 0px 3px rgba(85,187,51,0.15), 0px 4px 10px 0px rgba(0,0,0,0.06)'
            : '0px 4px 10px 0px rgba(0,0,0,0.06)',
          background: isDraggingOver ? 'rgba(85,187,51,0.04)' : 'white',
        }}
      >
        {/* Drag overlay hint */}
        <AnimatePresence>
          {isDraggingOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 pointer-events-none z-10"
              style={{ background: 'rgba(85,187,51,0.06)' }}
            >
              <ImageIcon size={22} className="text-[#55BB33]" strokeWidth={1.8} />
              <span className="text-sm font-semibold text-[#55BB33]">
                {t('aiChat.dropFile', 'Drop to attach')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={t('aiChat.placeholder')}
            className="w-full resize-none bg-transparent outline-none text-[15px] sm:text-base text-[#192514] placeholder:text-[#192514]/35 leading-relaxed py-1.5 max-h-[170px] overflow-y-auto font-newblack"
          />
        </div>

        <div className="w-full flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors hover:brightness-90"
            style={{ background: '#55BB33' }}
            title={t('aiChat.attachFile')}
          >
            <Plus size={17} color="#F8FFF6" strokeWidth={2.5} />
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.csv,.doc,.docx" className="hidden" onChange={handleFileChange} />

          <div className="flex items-center gap-2 ml-auto">
            <AnimatePresence>
              {hasMessages && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  onClick={onNewChat}
                  disabled={isThinking}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-35 hover:brightness-90"
                  style={{ background: '#192514' }}
                  title={t('aiChat.startNew')}
                >
                  <SquarePen size={15} color="#F8FFF6" strokeWidth={2} />
                </motion.button>
              )}
            </AnimatePresence>

            <div ref={modeMenuRef} className="relative shrink-0">
              <button
                onClick={() => setShowModeMenu((p) => !p)}
                className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hover:brightness-90"
                style={{ background: '#55BB33', color: '#F8FFF6' }}
              >
                {t(`aiChat.${responseMode.toLowerCase()}`)}
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
                    style={{ border: '1px solid rgba(25,37,20,0.10)', boxShadow: '0px 8px 20px rgba(0,0,0,0.12)', minWidth: '110px' }}
                  >
                    {['Detailed', 'Concise'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setResponseMode(opt); setShowModeMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors"
                        style={{ color: responseMode === opt ? '#55BB33' : '#192514', background: responseMode === opt ? 'rgba(85,187,51,0.08)' : 'transparent' }}
                      >
                        {t(`aiChat.${opt.toLowerCase()}`)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-35"
              style={{ background: 'transparent', border: '1.5px solid rgba(85,187,51,0.55)', color: '#55BB33' }}
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}