import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import ImageModal from './imageModal';
import { useTranslation } from 'react-i18next';

export default function UserBubble({ message }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();

  // 1. Look for 'files' to match aiChat.jsx's localStorage saving logic
  const files = message.files || [];
  const images = files.filter((f) => f.isImage);
  const docs = files.filter((f) => !f.isImage);

  // Only show the green text bubble if there's actual text OR a non-image document attached
  const hasTextBubble = message.text || docs.length > 0;

  return (
    <div className="flex flex-col items-end w-full min-w-0 gap-2">
      
      {/* 2. Images rendered ABOVE and OUTSIDE the text box */}
      {images.length > 0 && (
        <div className="flex flex-wrap justify-end gap-2 max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]">
          {images.map((img, i) => (
            <motion.img
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={img.dataUrl}
              alt={t('aiChat.attachedImageAlt')}
              onClick={() => setSelectedImage(img.dataUrl)}
              className="w-48 h-auto sm:w-64 rounded-xl object-cover border border-black/5 shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* 3. Text Bubble rendered BELOW the images (Hidden if empty) */}
      {hasTextBubble && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="
            max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]
            rounded-2xl rounded-tr-sm px-4 py-3
            text-base font-medium leading-relaxed break-words
          "
          style={{
            background: '#192514',
            color: '#F8FFF6',
            boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.18)',
            overflowWrap: 'anywhere',
          }}
        >
          {message.text && <div className="whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>{message.text}</div>}

          {/* Non-image files fallback */}
          {docs.length > 0 && (
            <div className={`flex flex-col gap-2 ${message.text ? 'mt-3' : ''}`}>
              {docs.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/10 w-fit rounded-lg px-2.5 py-1 text-xs"
                >
                  <FileText size={14} />
                  <span className="truncate max-w-[150px]">{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* 4. The Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
      
    </div>
  );
}