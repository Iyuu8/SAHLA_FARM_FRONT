import { ClipboardCheck } from 'lucide-react';
import CropInfoDropdown from './CropInfoDropdown';

/**
 * CropInfoCard
 *
 * Props — all shared with the Settings page via parent state (App.js or layout):
 *   crop            string
 *   setCrop         fn
 *   cropOptions     string[]
 *   growthStage     string
 *   setGrowthStage  fn
 *   mode            string
 *   setMode         fn
 *   actuators       { mode: 'auto' | 'semi-auto' }[]
 */
export default function CropInfoCard({
  crop,
  setCrop,
  cropOptions = [],
  growthStage,
  setGrowthStage,
  mode,
  setMode,
  actuators = [],
}) {
  const hasSemiAuto = actuators.some((a) => a.mode === 'semi-auto');

  const recommendedText =
    'Your plants are overheating and the soil is very dry. Water them promptly and, if possible, provide some shade or cover to reduce heat stress and prevent further damage.';

  const explanationText =
    'All systems are running in automatic mode. The farm is monitoring temperature, soil moisture, and light intensity continuously. Actuators will activate automatically when thresholds are exceeded.';

  return (
    <div
      className="w-full h-full rounded-2xl p-4 sm:p-5 flex flex-col gap-4 font-newblack"
      style={{
        background: 'linear-gradient(310deg, #192514 0%, #25371E 100%)',
      }}
    >
      {/* ── CROP ROW ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-white">Crop</span>
        <CropInfoDropdown
          value={crop}
          options={cropOptions}
          onChange={setCrop}
          placeholder="Select crop"
        />
      </div>

      {/* ── GROWTH STAGE ROW ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-white">Growth Stage</span>
        <CropInfoDropdown
          value={growthStage}
          options={[
            'Germination',
            'Seedling',
            'Vegetative Growth',
            'Flowering',
            'Fruiting',
            'Maturity',
          ]}
          onChange={setGrowthStage}
          placeholder="Select stage"
        />
      </div>

      {/* ── MODE ROW ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-white">Mode</span>
        <CropInfoDropdown
          value={mode}
          options={['balanced', 'water saving', 'energy saving', 'growth priority']}
          onChange={setMode}
          placeholder="Select mode"
        />
      </div>

      {/* ── RECOMMENDED ACTIONS / EXPLANATION ── */}
      <div
        className="rounded-xl p-3 sm:p-4 mt-auto flex flex-col gap-2"
        style={{
          background:
            'linear-gradient(to top left, rgba(189,214,48,0.10) 0%, rgba(85,187,51,0.10) 52%, rgba(29,42,23,0.10) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs sm:text-sm font-bold"
            style={{ color: 'rgba(236,243,234,1)' }}
          >
            {hasSemiAuto ? 'Recommended Actions' : 'Explanation of Actions'}
          </span>
          <ClipboardCheck
            size={14}
            strokeWidth={2}
            style={{ color: 'rgba(236,243,234,1)', flexShrink: 0 }}
          />
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.80)' }}
        >
          {hasSemiAuto ? recommendedText : explanationText}
        </p>
      </div>
    </div>
  );
}