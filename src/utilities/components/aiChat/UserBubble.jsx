import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon } from 'lucide-react';

// Safe image preview component to prevent memory leaks in React
function ImagePreview({ file }) {
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;
  
  return (
    <img 
      src={url} 
      alt="Attached preview" 
      className="w-full max-w-[260px] rounded-xl object-cover mt-2 border border-white/15 shadow-sm"
    />
  );
}

export default function UserBubble({ message }) {
  return (
    <div className="flex justify-end w-full">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="
          max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]
          rounded-2xl rounded-tr-sm px-4 py-3
          text-base font-medium leading-relaxed
        "
        style={{
          background: '#192514',
          color: '#F8FFF6',
          boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.18)',
        }}
      >
        {message.text}

        {/* Attached file & image rendering */}
        {message.files?.length > 0 && (
          <div className="mt-1 flex flex-col gap-2">
            {message.files.map((f, i) => {
              const isImg = f.type?.startsWith('image/');
              
              if (isImg) {
                return <ImagePreview key={i} file={f} />;
              }

              // Non-image files fallback to your original chip design
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/10 w-fit rounded-lg px-2.5 py-1 text-xs mt-2"
                >
                  <FileText size={14} />
                  <span className="truncate max-w-[150px]">{f.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}