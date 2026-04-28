import React, { useState, useEffect } from 'react'
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
import useProfileData from '../hooks/useProfileData';
import { supabase } from '../supabaseClient';

export default function ProfilePage() {
  const { t , i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [authEmail, setAuthEmail] = useState('');

  // Get actual auth email from Supabase
  useEffect(() => {
    const getAuthEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setAuthEmail(session.user.email);
      }
    };
    getAuthEmail();
  }, []);

  // Fetch real profile from backend
  const { data: backendUser, loading, error, invalidateCache } = useProfileData();

  const normalizedUser = backendUser ? {
    id: backendUser.id,
    userName: backendUser.username,
    email: authEmail || backendUser.email,
    age: backendUser.age,
    address: backendUser.address,
    pfp: backendUser.avatarUrl || '',
    homeAssistantId: backendUser.haUrl || '',
    displayUnits: {
      temp: backendUser.preferences?.displayUnits?.temperature || '°C',
      hum: backendUser.preferences?.displayUnits?.humidity || '%',
      soil: backendUser.preferences?.displayUnits?.soilMoisture || '%',
      light: backendUser.preferences?.displayUnits?.luminosity || 'lux',
      language: backendUser.preferences?.language || 'English',
    },
    farmSettings: NORMALIZED_USER.farmSettings,
  } : NORMALIZED_USER;

  const {
    mode, setMode, growthStage, setGrowthStage, crop, setCrop, cropOptions,
    addCropOption, temperatureUnit, setTemperatureUnit, humidityUnit, setHumidityUnit,
    soilMoistureUnit, setSoilMoistureUnit, lightIntensityUnit, setLightIntensityUnit,
    language, setLanguage,
  } = useFarmPreferences();
  
  const [actuators, setActuators] = useActuatorsState();

  const {
    modeOptions, manualControlOptions, growthStageOptions, languageOptions,
    temperatureOptions, humidityOptions, soilMoistureOptions, lightIntensityOptions,
  } = profileSettingOptions;

  const { homeAssistantId, displayUnits, farmSettings } = normalizedUser;
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHomeAssistantModalOpen, setIsHomeAssistantModalOpen] = useState(false);
  const [isPfpModalOpen, setIsPfpModalOpen] = useState(false);

  const { profileInfo, updateProfileInfo, updateProfilePhoto } = useProfileInfo(normalizedUser);

  const getConnectionParts = (connectionId) => {
    const splitIndex = connectionId?.toLowerCase().indexOf('bearer') ?? -1;
    if (splitIndex === -1) return { url: connectionId || '', token: '' };
    const url = connectionId.slice(0, splitIndex);
    const token = connectionId.slice(splitIndex + 6);
    return { url, token };
  };

  const [homeAssistantConnection, setHomeAssistantConnection] = useState({ url: '', token: '' });

  useEffect(() => {
    if (backendUser?.haUrl) {
      const parts = getConnectionParts(backendUser.haUrl);
      setHomeAssistantConnection({ url: parts.url, token: parts.token });
    }
  }, [backendUser?.haUrl]);

  const homeAssistantIdDisplay = homeAssistantConnection.token 
    ? `${homeAssistantConnection.url}Bearer${homeAssistantConnection.token}`
    : homeAssistantConnection.url;

  const allAuto = actuators.every((actuator) => actuator.mode === 'auto');
  const globalControlMode = allAuto ? 'auto' : 'semi-auto';
  const manualControlFromActuators = allAuto ? 'off' : 'on';

  if (loading) return (
    <div className='flex-1 min-h-0 h-full w-full bg-[#F5F7F6] flex items-center justify-center font-newblack'>
      <p className='text-[#192514] font-semibold text-lg'>Loading profile...</p>
    </div>
  );

  if (error) {
    const errorMessage = error.status === 401 ? 'Session expired.' : error.message;
    return (
      <div className='flex-1 min-h-0 h-full w-full bg-[#F5F7F6] flex items-center justify-center font-newblack'>
        <p className='text-red-500 font-semibold text-lg'>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className='flex-1 min-h-0 h-full w-full bg-[#F5F7F6] overflow-hidden p-2 sm:p-3 md:p-4 font-newblack flex items-center justify-center'>
      <section className='relative w-full max-w-[1200px] h-full sm:h-[95%] md:h-[92%] max-h-[920px] mx-auto bg-white rounded-xl shadow-[2px_2px_10px_0.5px_rgba(0,0,0,0.25)] overflow-hidden'>
        
        <div className='settings-scroll h-full min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4'>
          <div className='flex flex-col gap-4 sm:gap-5 md:gap-6 p-2 sm:p-3 md:p-4 pb-8 sm:pb-10 md:pb-12'>

        {/* ── PROFILE HEADER ── */}
        {isRTL ? (<div className={`relative flex items-center gap-3 sm:gap-4 ${isRTL ? 'pl-20 flex-row' : 'pr-20 flex-row-reverse'}`}>
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

          <div className={`flex flex-col gap-1 min-w-0 w-full ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}>
            <span className='text-lg sm:text-xl font-bold text-[#192514] capitalize truncate block w-full'>
              {profileInfo.userName}
            </span>
            <span className='text-xs sm:text-sm text-[rgba(25,37,20,0.6)] break-all block w-full'>
              {profileInfo.email}
            </span>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className={`absolute top-[20%] ${isRTL ? 'left-0' : 'right-0'} bg-[#55BB33] hover:bg-[#4ea531] text-white text-[1.5ch] font-normal px-5 py-1 rounded-lg transition-colors flex items-center`}
          >
            {t('profile.edit')}
          </button>
        </div>): 
        (
          <div className='relative flex items-center gap-3 sm:gap-4 pr-20'>
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
        )}
        
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
            {/* ── PROFILE HEADER ── */}
            <div className='relative flex items-center gap-3 sm:gap-4 pr-20'>
              <div className='relative group w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0'>
                {profileInfo.pfp ? (
                  <img src={profileInfo.pfp} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-lg md:text-xl font-bold text-gray-600">
                    {(profileInfo.userName || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type='button'
                  onClick={() => setIsPfpModalOpen(true)}
                  className='absolute inset-0 rounded-full bg-[rgba(25,37,20,0.45)] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                >
                  <span className='w-8 h-8 rounded-full bg-[#57BD36] flex items-center justify-center shadow-lg'>
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
                className='absolute top-1/2 -translate-y-1/2 right-0 bg-[#55BB33] hover:bg-[#4ea531] text-white text-[1.4ch] font-medium px-5 py-1.5 rounded-lg transition-colors'
              >
                {t('profile.edit')}
              </button>
            </div>

            <hr className='border-gray-100' />

            {/* ── FARM SETTINGS ── */}
            <div className='flex flex-col gap-4'>
              <h2 className='text-base sm:text-[2ch] font-semibold text-[#192514]'>{t('profile.farm_settings_title')}</h2>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                <FarmDropdown label={t('profile.labels.mode')} value={mode ?? farmSettings.mode} options={modeOptions} onChange={setMode} color={{ bg: '#192514', text: '#F8FFF6' }} />
                <FarmDropdown 
                  label={t('profile.labels.manual_control')} 
                  value={manualControlFromActuators} 
                  options={manualControlOptions} 
                  onChange={(next) => setActuators((prev) => prev.map((a) => ({ ...a, mode: next === 'on' ? 'semi-auto' : 'auto' })))} 
                  color={{ bg: '#192514', text: '#F8FFF6' }} 
                />
                <FarmDropdown label={t('profile.labels.growth')} value={growthStage ?? farmSettings.growth} options={growthStageOptions} onChange={setGrowthStage} color={{ bg: '#D6F7CB', text: '#000000' }} />
                <FarmDropdown label={t('profile.labels.crop')} value={crop ?? farmSettings.crop} options={cropOptions} onChange={(next) => { setCrop(next); addCropOption(next); }} color={{ bg: '#D6F7CB', text: '#000000' }} />
              </div>
              <div className='text-xs sm:text-sm text-[rgba(25,37,20,0.65)]'>
                {t('profile.global_mode')} <span className='font-semibold capitalize'>{globalControlMode}</span>
              </div>
            </div>

            {/* ── DISPLAY UNITS ── */}
            <div className='flex flex-col gap-2'>
              <span className='text-[1.5ch] font-semibold text-[rgba(25,37,20,0.9)] border-b border-[#192514] pb-1 w-fit'>{t('profile.display_units')}</span>
              <div className='flex flex-wrap gap-2 sm:gap-3 mt-1'>
                <PrefDropdown label={t('profile.labels.temperature')} value={temperatureUnit ?? displayUnits.temp} options={temperatureOptions} onChange={setTemperatureUnit} />
                <PrefDropdown label={t('profile.labels.humidity')} value={humidityUnit ?? displayUnits.hum} options={humidityOptions} onChange={setHumidityUnit} />
                <PrefDropdown label={t('profile.labels.soil_moisture')} value={soilMoistureUnit ?? displayUnits.soil} options={soilMoistureOptions} onChange={setSoilMoistureUnit} />
                <PrefDropdown label={t('profile.labels.light_intensity')} value={lightIntensityUnit ?? displayUnits.light} options={lightIntensityOptions} onChange={setLightIntensityUnit} />
                <PrefDropdown label={t('profile.labels.language')} value={language ?? displayUnits.language} options={languageOptions} onChange={setLanguage} />
              </div>
            </div>

          <div className='text-xs sm:text-sm text-[rgba(25,37,20,0.65)]'>
            {t('profile.global_mode')} <span className='font-semibold capitalize'>{t(`dashboard.manualModeCard.modes.${globalControlMode}`)}</span>
          </div>
            <hr className='border-gray-100' />

            {/* ── HOME ASSISTANT ── */}
            <div className='flex flex-col gap-4'>
              <h2 className='text-base sm:text-[2ch] font-bold text-[#192514]'>{t('profile.ha_connection')}</h2>
              <div className='bg-gray-100 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-center gap-4'>
                <div className='w-12 h-12 bg-[rgba(16,53,0,0.2)] rounded-xl flex items-center justify-center flex-shrink-0'>
                  <img src="/homeassistant-svgrepo-com 1.svg" alt="HA" className="w-10 h-10" />
                </div>
                <div className='flex flex-1 items-center gap-2 w-full'>
                  <span className={`text-sm font-bold ${backendUser?.haStatus === 'online' ? 'text-[#2E6900]' : 'text-red-500'}`}>
                    {backendUser?.haStatus === 'online' ? t('profile.online') : t('profile.offline')}
                  </span>
                  <input type="text" value={homeAssistantIdDisplay} className='flex-1 min-w-0 bg-white border border-[rgba(23,37,20,0.2)] rounded-lg px-3 py-2 text-[1.4ch] outline-none' readOnly />
                  <button onClick={() => setIsHomeAssistantModalOpen(true)} className='bg-[#57BD36] hover:bg-[#4ea531] text-white px-4 py-1.5 rounded-xl font-semibold transition-colors'>
                    {t('profile.edit')}
                  </button>
                </div>
              </div>
            </div>

            {/* ── MODALS ── */}
            <EditProfileModal
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              initialValues={profileInfo}
              onEditPhoto={() => {
                setIsProfileModalOpen(false);
                setIsPfpModalOpen(true);
              }}
              onSave={async (nextValues) => {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) throw new Error('Not authenticated');
                const res = await fetch('http://localhost:5000/api/settings/editProfile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                  body: JSON.stringify(nextValues),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Update failed');
                updateProfileInfo({
                  userName: nextValues.username,
                  email: nextValues.email,
                  address: nextValues.address,
                  age: nextValues.age,
                });
                invalidateCache();
                setIsProfileModalOpen(false);
              }}
            />

            <ProfilePictureEditorModal
              isOpen={isPfpModalOpen}
              onClose={() => setIsPfpModalOpen(false)}
              onConfirm={async (nextPfp) => {
                const dataURLtoBlob = (dataurl) => {
                  const arr = dataurl.split(',');
                  const mimeMatch = arr[0].match(/:(.*?);/);
                  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
                  const bstr = atob(arr[1]);
                  let n = bstr.length;
                  const u8arr = new Uint8Array(n);
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                  }
                  return new Blob([u8arr], { type: mime });
                };

                try {
                  console.log('[Avatar Upload] Starting upload process...');
                  const { data: { session } } = await supabase.auth.getSession();
                  console.log('[Avatar Upload] Session:', session?.user?.id);
                  if (!session) {
                    console.error('[Avatar Upload] No session found');
                    throw new Error('Not authenticated. Please log in again.');
                  }

                  let blob;
                  if (typeof nextPfp === 'string' && nextPfp.startsWith('data:')) {
                    blob = dataURLtoBlob(nextPfp);
                    console.log('[Avatar Upload] Blob created from data URL, size:', blob.size, 'bytes');
                  } else {
                    console.log('[Avatar Upload] Fetching blob from URL:', nextPfp);
                    const resBlob = await fetch(nextPfp);
                    blob = await resBlob.blob();
                    console.log('[Avatar Upload] Blob fetched, size:', blob.size, 'bytes');
                  }

                  if (!blob || blob.size === 0) {
                    throw new Error('Image blob is empty. Please try another image.');
                  }

                  const fileName = `avatars/${session.user.id}_${Date.now()}.png`;
                  console.log('[Avatar Upload] Uploading to Supabase:', fileName);
                  const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(fileName, blob, { upsert: true, contentType: 'image/png' });
                  console.log('[Avatar Upload] Upload response:', { data: uploadData, error: uploadError });
                  if (uploadError) {
                    console.error('[Avatar Upload] Supabase error:', uploadError);
                    throw new Error(`Supabase upload failed: ${uploadError.message || uploadError}`);
                  }

                  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                  console.log('[Avatar Upload] Public URL:', publicUrl);

                  console.log('[Avatar Upload] Sending to backend API...');
                  const apiRes = await fetch('http://localhost:5000/api/settings/editAvatarUrl', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                    body: JSON.stringify({ avatarUrl: publicUrl }),
                  });

                  console.log('[Avatar Upload] API response status:', apiRes.status);
                  if (!apiRes.ok) {
                    let errBody = {};
                    try {
                      errBody = await apiRes.json();
                    } catch (e) {
                      console.error('[Avatar Upload] Failed to parse error response:', e);
                    }
                    console.error('[Avatar Upload] API error:', errBody);
                    throw new Error(errBody.error || `Backend error: ${apiRes.statusText}`);
                  }

                  console.log('[Avatar Upload] Success! Updating profile...');
                  updateProfilePhoto(publicUrl);
                  invalidateCache();
                  setIsPfpModalOpen(false);
                } catch (err) {
                  console.error('[Avatar Upload] Full error:', err);
                  throw err;
                }
              }}
            />

            <EditHomeAssistantModal
              isOpen={isHomeAssistantModalOpen}
              onClose={() => setIsHomeAssistantModalOpen(false)}
              initialUrl={homeAssistantConnection.url}
              initialToken={homeAssistantConnection.token}
              onSave={(next) => {
                setHomeAssistantConnection(next);
                setIsHomeAssistantModalOpen(false);
              }}
            />

          </div>
        </div>
      </section>
    </div>
  )
}