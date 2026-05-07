// MonitoringAlerts.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AlertModal from './AlertModal';
import { formatWarningsToUI } from '../../functions/transformWarningsDashboard';

// Optional: map warning title to an icon URL (if you have custom SVG icons)
// For simplicity, we'll use a default alert icon – you can extend.
const getIconUrl = (title) => {
  // Return a data URL or a path; here we just return a placeholder.
  // You can replace with your own mapping, e.g.:
  // if (title === 'high_temperature_detected') return '/icons/high-temp.svg';
  if(title === "frost_risk") return "/frost.svg";
  if(title === "heavy_rainfall") return "/rain.svg";
};

// Map severity (0‑100) to a color (hex) for the icon background
const getSeverityColor = (severity = 50) => {
  if (severity >= 80) return '#E53935';
  if (severity >= 60) return '#FB8C00';
  if (severity >= 30) return '#FFC107';
  return '#9E9E9E';
};

export default function MonitoringAlerts({ warnings = [] }) {
  const { t } = useTranslation();
  const [selectedAlert, setSelectedAlert] = useState(null);

  const warningsUI = formatWarningsToUI(warnings);
  const warningsUIById = new Map(warningsUI.map((warning) => [warning.id, warning]));

  // Filter only active warnings (status === "active")
  const activeWarnings = (warnings || []).filter(w => w.status === 'active');

  return (
    <>
      <div
        className="w-full h-full rounded-2xl flex flex-col overflow-hidden font-newblack border border-white/5 shadow-xl"
        style={{
          background: `
            linear-gradient(to top, rgba(97, 174, 71, 0.10) 0%, rgba(0, 0, 0, 0) 100%),
            linear-gradient(290deg, rgba(70, 35, 24, 0.12) 0%, rgba(226, 42, 73, 0.12) 100%),
            linear-gradient(309deg, #1F2937, #0F172A)
          `,
        }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#EBB5A3] font-normal text-lg sm:text-[1.15rem] tracking-wide leading-none">
              {t('dashboard.monitoringAlerts.title')}
            </span>
            <TriangleAlert size={18} color="#EBB5A3" strokeWidth={2} />
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-[1.1ch] mt-2 leading-relaxed font-normal">
            {t('dashboard.monitoringAlerts.subtitle')}
          </p>
        </div>

        {/* Scrollable list */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 flex flex-col gap-3
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeWarnings.length === 0 ? (
            <p className="text-white/30 text-sm text-center mt-8">
              {t('dashboard.monitoringAlerts.noAlerts')}
            </p>
          ) : (
            activeWarnings.map((warning, index) => {
              const warningUI = warningsUIById.get(warning.id);
              const iconUrl = warningUI?.icon;
              const warningColor = warningUI?.color;

              return (
                <motion.button
                  key={warning.id}
                  type="button"
                  onClick={() => setSelectedAlert(warning)}
                  className="w-full rounded-xl px-4 py-4 flex items-center justify-between text-start"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(209,114,84,0.03) 0%, rgba(70,35,24,0.02) 55%, rgba(189,214,48,0.03) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.22, ease: 'easeOut' }}
                  whileHover={{
                    background:
                      'linear-gradient(135deg, rgba(209,114,84,0.03) 0%, rgba(70,35,24,0.03) 55%, rgba(189,214,48,0.03) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-[#FFE7DF] text-[0.9rem] font-normal leading-snug pe-3">
                    {t(`warnings.${warning.title}.title`, warning.title)}
                  </span>
                  <div
                    className="shrink-0 w-5 h-5"
                    style={{
                      backgroundColor: warningColor,
                      WebkitMaskImage: `url(${iconUrl})`,
                      maskImage: `url(${iconUrl})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                    }}
                  />
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Alert Modal – expects an alert object with id, title, description, severity, etc. */}
      <AnimatePresence>
        {selectedAlert && (
          <AlertModal
            alert={selectedAlert}
            config={{
              color: warningsUIById.get(selectedAlert.id)?.color,
              icon: warningsUIById.get(selectedAlert.id)?.icon,
            }}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}