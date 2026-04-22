import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getSeverityInfo = (severity) => {
  const num = Number(severity);
  if (isNaN(num)) {
    const upper = String(severity).toUpperCase();
    if (upper === 'HIGH' || upper === 'CRITICAL') return { label: 'HIGH', width: '85%' };
    if (upper === 'MEDIUM' || upper === 'MODERATE') return { label: 'MODERATE', width: '50%' };
    return { label: 'LOW', width: '25%' };
  }
  if (num >= 75) return { label: 'HIGH', width: `${num}%` };
  if (num >= 40) return { label: 'MODERATE', width: `${num}%` };
  return { label: 'LOW', width: `${num}%` };
};

export default function AlertModal({ alert, config, onClose }) {
  const { t } = useTranslation();
  if (!alert || !config) return null;

  // Change: Destructure 'icon' instead of 'Icon' (since it's now a string path)
  const { icon, color, bgColor } = config; 
  const severityInfo = getSeverityInfo(alert.severity);
  const bgColorForModal = bgColor || '#F5F7F6';

  const alertSubtitle = alert.label || 
    (alert.title 
      ? alert.title.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) 
      : t('dashboard.alertModal.fallbackSubtitle'));

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[3px] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-[500px] rounded-[24px] p-8 relative font-newblack shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
        style={{ backgroundColor: bgColorForModal }}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          aria-label={t('dashboard.alertModal.close')}
        >
          <X size={24} style={{ stroke: color }} strokeWidth={2} />
        </button>

        {/* Hero Section */}
        <div
          className="flex items-center gap-6 pb-6"
          style={{ borderBottom: '2px solid rgba(25, 37, 20, 0.60)' }}
        >
          {/* UPDATED: Render the SVG via img tag */}
          <div className="w-[120px] h-[120px] shrink-0 flex items-center justify-center">
            <div 
                className="w-full h-full"
                style={{
                    backgroundColor: color, // This dynamically paints the icon with your exact hex color!
                    WebkitMaskImage: `url(${alert.icon || icon})`,
                    maskImage: `url(${alert.icon || icon})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-[13px] font-bold tracking-[0.14em] uppercase"
                style={{ color }}
              >
                {t('dashboard.alertModal.liveAlert')}
              </span>
            </div>
            <h2 className="text-[32px] font-extrabold text-[#192514] leading-tight mb-2">
              {t('dashboard.alertModal.systemAlert')}
            </h2>
            <p className="text-[16px] font-medium leading-snug" style={{ color: '#192514' }}>
              {alertSubtitle}
            </p>
          </div>
        </div>

        {/* Severity bar */}
        <div
          className="flex items-center gap-4 mt-5 mb-5 px-4 py-3.5 rounded-r-[8px]"
          style={{
            background: `${color}26`,
            borderLeft: `4px solid ${color}`,
          }}
        >
          <span
            className="text-[12px] font-bold tracking-[0.12em] uppercase whitespace-nowrap font-newblack"
            style={{ color }}
          >
            {t('dashboard.alertModal.severityLabel')}
          </span>
          <div
            className="flex-1 h-[6px] rounded-full overflow-hidden"
            style={{ background: `${color}8a` }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: severityInfo.width }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span
            className="text-[12px] font-bold tracking-[0.12em] uppercase whitespace-nowrap font-newblack"
            style={{ color }}
          >
            {t(`dashboard.alertModal.severity.${severityInfo.label}`)}
          </span>
        </div>

        {/* Description Section */}
        <div className="description-container">
          <h3 className="text-[20px] font-bold text-[#192514] mb-2.5">{t('dashboard.alertModal.description')}</h3>
          <p className="text-[15px] leading-[1.65]" style={{ color: 'rgba(17, 40, 0, 0.90)' }}>
            {alert.description}
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}