import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { NORMALIZED_USER, profileSettingOptions } from "./../utilities/data/profileSettings"
import EditProfileModal from './../utilities/components/settings/EditProfileModal';
import EditHomeAssistantModal from './../utilities/components/settings/EditHomeAssistantModal';
import FarmDropdown from './../utilities/components/settings/FarmDropdown';
import PrefDropdown from './../utilities/components/settings/PrefDropdown';
import ProfilePictureEditorModal from './../utilities/components/settings/ProfilePictureEditorModal';
import useProfileInfo from './../hooks/useProfileInfo';
import useFarmPreferences from '../hooks/useFarmPreferences';
import useActuatorsState from '../hooks/useActuatorsState';
import { useTranslation } from 'react-i18next';


/**
 * Settings page for profile + farm preferences.
 *
 * How it works with Dashboard/AIchat:
 * - User profile is persisted via useProfileInfo.
 * - Farm preferences are loaded/saved by useFarmPreferences and reused by Dashboard and AIchat.
 * - Actuators are loaded from shared storage to expose current global control mode context.
 */
export default function ProfilePage() {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    growthStage,
    setGrowthStage,
    crop,
    setCrop,
    cropOptions,
    addCropOption,
    temperatureUnit,
    setTemperatureUnit,
    humidityUnit,
    setHumidityUnit,
    soilMoistureUnit,
    setSoilMoistureUnit,
    lightIntensityUnit,
    setLightIntensityUnit,
    language,
    setLanguage,
  } = useFarmPreferences();

  const [actuators, setActuators] = useActuatorsState();

  const {
    modeOptions,
    manualControlOptions,
    growthStageOptions,
    languageOptions,
    temperatureOptions,
    humidityOptions,
    soilMoistureOptions,
    lightIntensityOptions,
  } = profileSettingOptions;

  // Settings page reads normalized profile defaults so backend USER_INFO shape changes
  // are absorbed in profileSettings normalization layer.
  const { homeAssistantId, displayUnits, farmSettings } = NORMALIZED_USER;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHomeAssistantModalOpen, setIsHomeAssistantModalOpen] = useState(false);
  const [isPfpModalOpen, setIsPfpModalOpen] = useState(false);

  const { profileInfo, updateProfileInfo, updateProfilePhoto } = useProfileInfo(NORMALIZED_USER);

  const getConnectionParts = (connectionId) => {
    const splitIndex = connectionId.toLowerCase().indexOf('bearer');
    if (splitIndex === -1) {
      return { url: connectionId, token: '' };
    }

    const url = connectionId.slice(0, splitIndex);
    const token = connectionId.slice(splitIndex + 6);
    return { url, token };
  };

  const initialConnection = getConnectionParts(homeAssistantId || '');

  const [homeAssistantConnection, setHomeAssistantConnection] = useState({
    url: initialConnection.url,
    token: initialConnection.token,
  });

  const homeAssistantIdDisplay = `${homeAssistantConnection.url}Bearer${homeAssistantConnection.token}`;
  const allAuto = actuators.every((actuator) => actuator.mode === 'auto');
  const globalControlMode = allAuto ? 'auto' : 'semi-auto';
  const manualControlFromActuators = allAuto ? 'off' : 'on';

  return (
    <div className='flex-1 min-h-0 h-full w-full bg-[#F5F7F6] overflow-hidden p-2 sm:p-3 md:p-4 font-newblack flex items-center justify-center'>
      <section className='relative w-full max-w-[1200px] h-full sm:h-[95%] md:h-[92%] max-h-[920px] mx-auto bg-white rounded-xl shadow-[2px_2px_10px_0.5px_rgba(0,0,0,0.25)] overflow-hidden'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-6 sm:h-8 bg-gradient-to-b from-white via-white/90 to-transparent z-10' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-white via-white/90 to-transparent z-10' />

        <div className='settings-scroll h-full min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4'>
          <div className='flex flex-col gap-4 sm:gap-5 md:gap-6 p-2 sm:p-3 md:p-4 pb-8 sm:pb-10 md:pb-12'>

        {/* ── PROFILE HEADER ── */}
        <div className='relative flex items-center gap-3 sm:gap-4 pr-20' >
          <div className='relative group w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0'>
            {profileInfo.pfp ? (
              <img src={profileInfo.pfp} alt="Profile avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-lg md:text-xl font-bold text-gray-600">
                {profileInfo.userName.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              type='button'
              onClick={() => setIsPfpModalOpen(true)}
              className='absolute inset-0 rounded-full bg-[rgba(25,37,20,0.45)] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
              aria-label='Change profile picture'
            >
              <span className='w-8 h-8 rounded-full bg-[#57BD36] flex items-center justify-center shadow-[0_3px_8px_rgba(0,0,0,0.18)]'>
                <FiEdit2 size={14} />
              </span>
            </button>
          </div>
          <div className='flex flex-col gap-1 min-w-0'>
            <span className='text-lg sm:text-xl font-bold text-[#192514] capitalize truncate'>{profileInfo.userName}</span>
            <span className='text-xs sm:text-sm text-[rgba(25,37,20,0.6)] break-all'>{profileInfo.email}</span>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className='absolute top-[20%] right-0 bg-[#55BB33] hover:bg-[#4ea531] text-white text-[1.5ch] font-normal px-5 py-1 rounded-lg transition-colors flex items-center'
          >
            {t('profile.edit')}
          </button>
        </div>

        <hr className='border-gray-100' />

        {/* ── FARM SETTINGS ── */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-base sm:text-[2ch] font-semibold  text-[#192514]'>{t('profile.farm_settings_title')}</h2>

          <div className='flex flex-col gap-2'>
            <span className='text-[1.5ch] font-semibold text-[rgba(25,37,20,0.9)] border-b border-[#192514] pb-1 w-fit'>
              {t('profile.farm_settings_subtitle')}
            </span>
            <div className='flex flex-wrap gap-2 sm:gap-3 mt-1'>
              <FarmDropdown
                label={t('profile.labels.mode')}
                value={mode ?? farmSettings.mode}
                options={modeOptions || []}
                onChange={setMode}
                color={{ bg: '#192514', text: '#F8FFF6' }}
              />
              <FarmDropdown
                label={t('profile.labels.manual_control')}
                value={manualControlFromActuators ?? farmSettings.manualControl}
                options={manualControlOptions || []}
                onChange={(next) => {
                  // Keep settings selector and dashboard actuator mode tied to the same data source.
                  setActuators((prev) => prev.map((actuator) => ({
                    ...actuator,
                    mode: next === 'on' ? 'semi-auto' : 'auto',
                  })));
                }}
                color={{ bg: '#192514', text: '#F8FFF6' }}
              />
              <FarmDropdown
                label={t('profile.labels.growth')}
                value={growthStage ?? farmSettings.growth}
                options={growthStageOptions || []}
                onChange={setGrowthStage}
                color={{ bg: '#D6F7CB', text: '#000000' }}
              />
              <FarmDropdown
                label={t('profile.labels.crop')}
                value={crop ?? farmSettings.crop}
                options={cropOptions || []}
                onChange={(nextCrop) => {
                  setCrop(nextCrop);
                  addCropOption(nextCrop);
                }}
                color={{ bg: '#D6F7CB', text: '#000000' }}
              />
            </div>
          </div>

          <div className='text-xs sm:text-sm text-[rgba(25,37,20,0.65)]'>
            {t('profile.global_mode')} <span className='font-semibold capitalize'>{globalControlMode}</span>
          </div>

          {/* ── DISPLAY UNITS ── */}
          <div className='flex flex-col gap-2 mt-2'>
            <span className='text-[1.5ch] font-semibold text-[rgba(25,37,20,0.9)] border-b border-[#192514] pb-1 w-fit'>
              {t('profile.display_units')}
            </span>
            <div className='flex flex-wrap gap-2 sm:gap-3 mt-1'>
              <PrefDropdown
                label={t('profile.labels.temperature')}
                value={temperatureUnit ?? displayUnits.temp}
                options={temperatureOptions || []}
                onChange={setTemperatureUnit}
              />
              <PrefDropdown
                label={t('profile.labels.humidity')}
                value={humidityUnit ?? displayUnits.hum}
                options={humidityOptions || []}
                onChange={setHumidityUnit}
              />
              <PrefDropdown
                label={t('profile.labels.soil_moisture')}
                value={soilMoistureUnit ?? displayUnits.soil}
                options={soilMoistureOptions || []}
                onChange={setSoilMoistureUnit}
              />
              <PrefDropdown
                label={t('profile.labels.light_intensity')}
                value={lightIntensityUnit ?? displayUnits.light}
                options={lightIntensityOptions || []}
                onChange={setLightIntensityUnit}
              />
              <PrefDropdown
                label={t('profile.labels.language')}
                value={language ?? displayUnits.language}
                options={languageOptions || []}
                onChange={setLanguage}
              />
              
            </div>
          </div>
        </div>

        <hr className='border-gray-100' />

        {/* ── HOME ASSISTANT CONNECTION ── */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-base sm:text-[2ch] font-bold text-[#192514]'>{t('profile.ha_connection')}</h2>
          <div className='bg-gray-100 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-5'>
            {/* HA icon */}
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-[rgba(16,53,0,0.2)] rounded-xl flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0'>
              <img src="/homeassistant-svgrepo-com 1.svg" alt="Home Assistant" className="w-10 h-10" />
            </div>

            <div className='flex items-center justify-center lg:justify-start gap-2'>
              <span className='text-sm sm:text-base font-bold text-[#192514]'>{t('profile.status')}</span>
              <span className='text-sm sm:text-base font-bold text-[#2E6900]'>{t('profile.online')}</span>
              <input
                type="text"
                value={homeAssistantIdDisplay}
                className='flex-1 min-w-0 bg-white border border-[rgba(23,37,20,0.2)] rounded-lg px-3 py-2 text-[1.5ch] text-[#192514] outline-none font-semibold'
                readOnly
              />
              <button
                onClick={() => setIsHomeAssistantModalOpen(true)}
                className='bg-[#57BD36] hover:bg-[#4ea531] text-[#F8FFF6] text-[1.8ch] font-semibold px-4 py-1 rounded-[12px] transition-colors whitespace-nowrap font-newblack'
              >
                {t('profile.edit')}
              </button>
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialValues={profileInfo}
          onSave={(nextValues) => {
            updateProfileInfo(nextValues);
            setIsProfileModalOpen(false);
          }}
        />

        <ProfilePictureEditorModal
          isOpen={isPfpModalOpen}
          onClose={() => setIsPfpModalOpen(false)}
          onConfirm={(nextPfp) => {
            updateProfilePhoto(nextPfp);
          }}
        />

        <EditHomeAssistantModal
          isOpen={isHomeAssistantModalOpen}
          onClose={() => setIsHomeAssistantModalOpen(false)}
          initialUrl={homeAssistantConnection.url}
          initialToken={homeAssistantConnection.token}
          onSave={(nextConnection) => {
            setHomeAssistantConnection(nextConnection);
            setIsHomeAssistantModalOpen(false);
          }}
        />

          </div>
        </div>
      </section>
    </div>
  )
}
