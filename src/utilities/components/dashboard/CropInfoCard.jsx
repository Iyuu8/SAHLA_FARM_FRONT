import { ClipboardCheck } from 'lucide-react';
import CropInfoDropdown from './CropInfoDropdown';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import DynamicTranslator from '../Translation/DynamicTranslator';
import {translateText } from '../../functions/translateText'

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
  recommendation = null,
  socket,                 
  liveCropOptions,       
}) {
  const { t , i18n} = useTranslation();

  // Use live HA options if available, otherwise fallback to local cropOptions
  const displayOptions = (liveCropOptions && liveCropOptions.length) ? liveCropOptions : cropOptions;

  // Override the add-crop behaviour: send to HA via socket, then update local state
  const handleAddCrop = useCallback(async (newCropName) => {
    const trimmed = newCropName.trim();
    if (!trimmed) return;

    // Always save in English regardless of the app's current language
    const englishName = await translateText(trimmed, 'en');
    const nameToSave = englishName?.trim() || trimmed;

    if (socket) {
      socket.emit('add_crop', { newCropName: nameToSave });
    } else {
      onAddCropOption?.(nameToSave);
      setCrop(nameToSave);
    }
  }, [socket, onAddCropOption, setCrop]);

  return (
    <div
      className="w-full h-full rounded-2xl p-4 sm:p-5 font-newblack flex flex-col gap-3"
      style={{ background: 'linear-gradient(310deg, #192514 0%, #25371E 100%)' }}
    >
      <div className="flex flex-col xs:flex-row lg:flex-col gap-3 h-full">
        <div className="flex flex-col gap-3 shrink-0 w-full xs:w-[45%] lg:w-full xs:justify-center lg:justify-start">

          {/* CROP — editable combobox with auto-add */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.crop')}</span>
            <CropInfoDropdown
              value={crop}
              options={displayOptions}
              onChange={setCrop}
              onAddOption={handleAddCrop}        // ← key change
              placeholder={t('dashboard.cropInfo.enterCrop')}
              isCropInput
            />
          </div>

          {/* GROWTH STAGE (unchanged) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.growthStage')}</span>
            <CropInfoDropdown
              value={growthStage}
              options={[
                'Germination',
                'Seedling',
                'Vegetative',
                'Flowering',
                'Fruiting',
                'Maturity'
              ]}
              onChange={setGrowthStage}
              placeholder={t('dashboard.cropInfo.selectStage')}
            />
          </div>

          {/* MODE (unchanged) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white whitespace-nowrap">{t('dashboard.cropInfo.mode')}</span>
            <CropInfoDropdown
              value={mode}
              options={[
                'Balanced',
                'Water saving',
                'Energy saving',
                'Growth priority'
              ]}
              onChange={setMode}
              placeholder={t('dashboard.cropInfo.selectMode')}
            />
          </div>
        </div>

        {/* RECOMMENDED ACTIONS (unchanged) */}
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
              {t('dashboard.cropInfo.general', { defaultValue: 'General' })}
            </span>
            <ClipboardCheck
              size={14}
              strokeWidth={2}
              style={{ color: 'rgba(236,243,234,1)', flexShrink: 0 }}
            />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
            <DynamicTranslator text={recommendation} language={i18n.language} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }} />
          </p>
        </div>
      </div>
    </div>
  );
}