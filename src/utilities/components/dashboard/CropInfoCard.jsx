import { ClipboardCheck } from 'lucide-react';
import CropInfoDropdown from './CropInfoDropdown';
import { useTranslation } from 'react-i18next';

/**
 * CropInfoCard
 *
 * Props:
 * crop            string
 * setCrop         fn
 * cropOptions     string[]
 * onAddCropOption fn          — adds a new crop to the shared options list
 * growthStage     string
 * setGrowthStage  fn
 * mode            string
 * setMode         fn
 * actuators       { mode: 'auto' | 'semi-auto' }[]
 */
export default function CropInfoCard({
  crop,
  setCrop,
  cropOptions = [],
  onAddCropOption,
  growthStage,
  setGrowthStage,
  mode,
  setMode,
  actuators = [],
}) {
  const { t } = useTranslation();
  const hasSemiAuto = actuators.some((a) => a.mode === 'semi-auto');

  const recommendedText =
    'Your plants are overheating and the soil is very dry. Water them promptly and, if possible, provide some shade or cover to reduce heat stress and prevent further damage.';

  const explanationText =
    'All systems are running in automatic mode. The farm is monitoring temperature, soil moisture, and light intensity continuously. Actuators will activate automatically when thresholds are exceeded.';

  return (
    <div
      className="w-full h-full rounded-2xl p-4 sm:p-5 font-newblack flex flex-col gap-3"
      style={{ background: 'linear-gradient(310deg, #192514 0%, #25371E 100%)' }}
    >
      {/* Layout:
        - Mobile (< xs): Stacked (flex-col)
        - Tablet (xs to lg): Side-by-side (xs:flex-row)
        - Desktop (lg+): Stacked again (lg:flex-col)
      */}
      <div className="flex flex-col xs:flex-row lg:flex-col gap-3 h-full">

        {/* LEFT / TOP: Selectors */}
        {/* Width logic ensures it is full width when stacked, and ~45% width when side-by-side */}
        <div className="flex flex-col gap-3 shrink-0 w-full xs:w-[45%] lg:w-full xs:justify-center lg:justify-start">

          {/* CROP — text input */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.crop')}</span>
            <CropInfoDropdown
              value={crop}
              options={cropOptions}
              onChange={setCrop}
              onAddOption={onAddCropOption}
              placeholder={t('dashboard.cropInfo.enterCrop')}
              isCropInput
            />
          </div>

          {/* GROWTH STAGE */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.growthStage')}</span>
            <CropInfoDropdown
              value={growthStage}
              options={[
                t('dashboard.cropInfo.stages.germination'), 
                t('dashboard.cropInfo.stages.seedling'), 
                t('dashboard.cropInfo.stages.vegetativeGrowth'), 
                t('dashboard.cropInfo.stages.flowering'), 
                t('dashboard.cropInfo.stages.fruiting'), 
                t('dashboard.cropInfo.stages.maturity')
              ]}
              onChange={setGrowthStage}
              placeholder={t('dashboard.cropInfo.selectStage')}
            />
          </div>

          {/* MODE */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.mode')}</span>
            <CropInfoDropdown
              value={mode}
              options={[
                t('dashboard.cropInfo.modes.balanced'), 
                t('dashboard.cropInfo.modes.waterSaving'), 
                t('dashboard.cropInfo.modes.energySaving'), 
                t('dashboard.cropInfo.modes.growthPriority')
              ]}
              onChange={setMode}
              placeholder={t('dashboard.cropInfo.selectMode')}
            />
          </div>
        </div>

        {/* RIGHT / BOTTOM: Recommended Actions box */}
        <div
          className="flex-1 rounded-xl p-3 sm:p-4 flex flex-col gap-2 w-full xs:w-auto lg:w-full"
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
              {hasSemiAuto ? t('dashboard.cropInfo.recommendedActions') : t('dashboard.cropInfo.explanationOfActions')}
            </span>
            <ClipboardCheck
              size={14}
              strokeWidth={2}
              style={{ color: 'rgba(236,243,234,1)', flexShrink: 0 }}
            />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
            {hasSemiAuto ? t('dashboard.cropInfo.recommendedText') : t('dashboard.cropInfo.explanationText')}
          </p>
        </div>

      </div>
    </div>
  );
}