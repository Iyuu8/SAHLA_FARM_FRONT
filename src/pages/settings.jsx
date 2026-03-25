import React, { useState } from 'react'
import { user } from "./../utilities/data/profileSettings"
import EditProfileModal from './../utilities/components/settings/EditProfileModal';
import EditHomeAssistantModal from './../utilities/components/settings/EditHomeAssistantModal';
import FarmDropdown from './../utilities/components/settings/FarmDropdown';
import PrefDropdown from './../utilities/components/settings/PrefDropdown';

export default function ProfilePage({
  mode,
  setMode,
  modeOptions,
  manualControl,
  setManualControl,
  manualControlOptions,
  growthStage,
  setGrowthStage,
  growthStageOptions,
  crop,
  setCrop,
  cropOptions,
  temperatureUnit,
  setTemperatureUnit,
  temperatureOptions,
  humidityUnit,
  setHumidityUnit,
  humidityOptions,
  soilMoistureUnit,
  setSoilMoistureUnit,
  soilMoistureOptions,
  lightIntensityUnit,
  setLightIntensityUnit,
  lightIntensityOptions,
  language,
  setLanguage,
  languageOptions,
}) {
  const { pfp, userName, email, homeAssistantId, displayUnits, farmSettings } = user;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHomeAssistantModalOpen, setIsHomeAssistantModalOpen] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    userName,
    email,
    address: user.address ?? '',
    age: user.age ?? '',
    password: user.password || '',
  });

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

  return (
    <div className='flex-1 h-full min-h-0 w-full bg-[#F5F7F6] overflow-hidden p-2 sm:p-3 md:p-4 font-newblack'>
      <section className='relative top-1/2 -translate-y-1/2 h-auto w-full md:w-[95%] mx-auto bg-white rounded-xl shadow-[2px_2px_10px_0.5px_rgba(0,0,0,0.25)] flex flex-col gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-8 overflow-visible'>

        {/* ── PROFILE HEADER ── */}
        <div className='relative flex items-center gap-3 sm:gap-4 pr-20'>
          {pfp ? (
            <img src={pfp} alt="Profile picture" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center text-lg md:text-xl font-bold text-gray-600 flex-shrink-0">
              {profileInfo.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className='flex flex-col gap-1 min-w-0'>
            <span className='text-lg sm:text-xl font-bold text-[#192514] capitalize truncate'>{profileInfo.userName}</span>
            <span className='text-xs sm:text-sm text-[rgba(25,37,20,0.6)] break-all'>{profileInfo.email}</span>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className='absolute top-[20%] right-0 bg-[#55BB33] hover:bg-[#4ea531] text-white text-[1.5ch] font-normal px-5 py-1 rounded-lg transition-colors flex items-center'
          >
            Edit
          </button>
        </div>

        <hr className='border-gray-100' />

        {/* ── FARM SETTINGS ── */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-base sm:text-[2ch] font-semibold  text-[#192514]'>Farm Settings & Preferences</h2>

          <div className='flex flex-col gap-2'>
            <span className='text-[1.5ch] font-semibold text-[rgba(25,37,20,0.9)] border-b border-[#192514] pb-1 w-fit'>
              Farm Settings
            </span>
            <div className='flex flex-wrap gap-2 sm:gap-3 mt-1'>
              <FarmDropdown
                label="Mode"
                value={mode ?? farmSettings.mode}
                options={modeOptions || []}
                onChange={setMode}
                color={{ bg: '#192514', text: '#F8FFF6' }}
              />
              <FarmDropdown
                label="Manual Control"
                value={manualControl ?? farmSettings.manualControl}
                options={manualControlOptions || []}
                onChange={setManualControl}
                color={{ bg: '#192514', text: '#F8FFF6' }}
              />
              <FarmDropdown
                label="Growth"
                value={growthStage ?? farmSettings.growth}
                options={growthStageOptions || []}
                onChange={setGrowthStage}
                color={{ bg: '#D6F7CB', text: '#000000' }}
              />
              <FarmDropdown
                label="Crop"
                value={crop ?? farmSettings.crop}
                options={cropOptions || []}
                onChange={setCrop}
                color={{ bg: '#D6F7CB', text: '#000000' }}
              />
            </div>
          </div>

          {/* ── DISPLAY UNITS ── */}
          <div className='flex flex-col gap-2 mt-2'>
            <span className='text-[1.5ch] font-semibold text-[rgba(25,37,20,0.9)] border-b border-[#192514] pb-1 w-fit'>
              Display Units
            </span>
            <div className='flex flex-wrap gap-2 sm:gap-3 mt-1'>
              <PrefDropdown
                label="Temperature"
                value={temperatureUnit ?? displayUnits.temp}
                options={temperatureOptions || []}
                onChange={setTemperatureUnit}
              />
              <PrefDropdown
                label="Humidity"
                value={humidityUnit ?? displayUnits.hum}
                options={humidityOptions || []}
                onChange={setHumidityUnit}
              />
              <PrefDropdown
                label="Soil Moisture"
                value={soilMoistureUnit ?? displayUnits.soil}
                options={soilMoistureOptions || []}
                onChange={setSoilMoistureUnit}
              />
              <PrefDropdown
                label="Light Intensity"
                value={lightIntensityUnit ?? displayUnits.light}
                options={lightIntensityOptions || []}
                onChange={setLightIntensityUnit}
              />
              <PrefDropdown
                label="Language"
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
          <h2 className='text-base sm:text-[2ch] font-bold text-[#192514]'>Home Assistant Connection</h2>
          <div className='bg-gray-100 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-5'>
            {/* HA icon */}
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-[rgba(16,53,0,0.2)] rounded-xl flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0'>
              <img src="/homeassistant-svgrepo-com 1.svg" alt="Home Assistant" className="w-10 h-10" />
            </div>

            <div className='flex items-center justify-center lg:justify-start gap-2'>
              <span className='text-sm sm:text-base font-bold text-[#192514]'>Status:</span>
              <span className='text-sm sm:text-base font-bold text-[#2E6900]'>Online</span>
              <span className='w-2 h-2 rounded-full bg-[#57BD36] inline-block shadow-[0px_0px_5px_3px_rgb(104,225,65)]'></span>
            </div>

            <div className='flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:ml-4 min-w-0'>
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
                Change
              </button>
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialValues={profileInfo}
          currentPassword={profileInfo.password}
          onSave={(nextValues) => {
            setProfileInfo((prev) => ({
              ...prev,
              userName: nextValues.userName,
              email: nextValues.email,
              address: nextValues.address,
              age: nextValues.age,
              password: nextValues.password || prev.password,
            }));
            setIsProfileModalOpen(false);
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

      </section>
    </div>
  )
}
