import { motion } from 'framer-motion';
import MessageContent from './MessageContent';

/**
 * AIBubble — AI assistant message.
 *
 * Desktop: logo left, bubble right.
 * Mobile: logo + label on top, full-width bubble below.
 *
 * Logo changed to /logo_sahla.svg as requested.
 */
export default function AIBubble({ segments }) {
  const logo = (
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
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full flex flex-col sm:flex-row items-start gap-3"
    >
      {/* Logo — always visible */}
      <div className="flex items-center gap-2 sm:mt-0.5 flex-shrink-0">
        {logo}
        {/* Label only on mobile */}
        <span className="text-sm font-semibold sm:hidden" style={{ color: '#192514' }}>
          SAHLA
        </span>
      </div>

      {/* Bubble */}
      <div
        className="w-full sm:max-w-[78%] lg:max-w-[68%] rounded-2xl rounded-tl-sm px-4 py-3 font-newblack"
        style={{
          background: '#EBF7E6',
          color: '#192514',
          boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.10)',
          fontSize: '15px',
        }}
      >
        <MessageContent segments={segments} />
      </div>
    </motion.div>
  );
}