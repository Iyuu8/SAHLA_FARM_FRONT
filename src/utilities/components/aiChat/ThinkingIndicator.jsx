import { motion } from 'framer-motion';

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#D6F7CB' }}
      >
        <img
          src="/logo_sahla.svg"
          alt="SAHLA"
          className="w-7 h-7 object-contain"
          style={{ display: 'block' }}
        />
      </div>
      <span className="text-base font-medium" style={{ color: '#192514' }}>
        Thinking
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
          >
            .
          </motion.span>
        ))}
      </span>
    </div>
  );
}