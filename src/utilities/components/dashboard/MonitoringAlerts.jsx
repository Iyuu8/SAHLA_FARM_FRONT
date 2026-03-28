import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TriangleAlert,
  Sun,
  Snowflake,
  Droplet,
  Droplets,
} from 'lucide-react';
import AlertModal from './AlertModal';
import { INITIAL_WARNINGS } from '../../data/dashboardData';
import { formatWarningsToUI } from './../../functions/transformWarningsDashboard'

export default function MonitoringAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Filters out the false values based on your instruction requirement
  const activeWarnings = formatWarningsToUI(INITIAL_WARNINGS);

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
        {/* ── Header ── */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#EBB5A3] font-normal text-lg sm:text-[1.15rem] tracking-wide leading-none">
              Monitoring Alerts
            </span>
            <TriangleAlert size={18} color="#EBB5A3" strokeWidth={2} />
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-[1.1ch] mt-2 leading-relaxed font-normal">
            Track critical environmental situations in real time.
          </p>
        </div>

        {/* ── Scrollable list ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 flex flex-col gap-3
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeWarnings.length === 0 ? (
            <p className="text-white/30 text-sm text-center mt-8">No active alerts</p>
          ) : (
            activeWarnings.map((warning, index) => {
              const Icon = warning.icon;

              return (
                <motion.button
                  key={warning.id}
                  type="button"
                  onClick={() => setSelectedAlert(warning)}
                  className="w-full rounded-xl px-4 py-4 flex items-center justify-between text-left"
                  style={{
                    // Opacity divided significantly to match the subtle dark glassy card style
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
                  <span className="text-[#FFE7DF] text-[0.9rem] font-normal leading-snug pr-3">
                    {warning.title}
                  </span>
                  <div
                    className="shrink-0 w-5 h-5" 
                    style={{
                        backgroundColor: warning.color, /* <-- Changed from iconColor to warning.color */
                        WebkitMaskImage: `url(${warning.icon})`,
                        maskImage: `url(${warning.icon})`,
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

      {/* Alert Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <AlertModal
            alert={selectedAlert}
            config={{ color: selectedAlert.color, Icon: selectedAlert.icon }}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}