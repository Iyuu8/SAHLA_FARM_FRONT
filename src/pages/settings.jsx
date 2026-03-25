import React, { useEffect, useRef, useState } from 'react'
import { user } from "./../utilities/data/profileSettings"
import { FaCaretDown } from 'react-icons/fa6';

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

  return (
    <div className='flex-1 h-full min-h-0 w-full bg-[#F5F7F6] overflow-hidden p-2 sm:p-3 md:p-4 font-newblack'>
      <section className='relative top-1/2 -translate-y-1/2 h-auto w-full md:w-[95%] mx-auto bg-white rounded-xl shadow-[2px_2px_10px_0.5px_rgba(0,0,0,0.25)] flex flex-col gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-8 overflow-visible'>

        {/* ── PROFILE HEADER ── */}
        <div className='relative flex items-center gap-3 sm:gap-4 pr-20'>
          {pfp ? (
            <img src={pfp} alt="Profile picture" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center text-lg md:text-xl font-bold text-gray-600 flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className='flex flex-col gap-1 min-w-0'>
            <span className='text-lg sm:text-xl font-bold text-[#192514] capitalize truncate'>{userName}</span>
            <span className='text-xs sm:text-sm text-[rgba(25,37,20,0.6)] break-all'>{email}</span>
          </div>

          <button className='absolute top-[20%] right-0 bg-[#55BB33] hover:bg-[#4ea531] text-white text-[1.5ch] font-normal px-5 py-1 rounded-lg transition-colors flex items-center'>
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
                defaultValue={homeAssistantId}
                className='flex-1 min-w-0 bg-white border border-[rgba(23,37,20,0.2)] rounded-lg px-3 py-2 text-[1.5ch] text-[#192514] outline-none font-semibold'
                readOnly
              />
              <button className='bg-[#57BD36] hover:bg-[#4ea531] text-[#F8FFF6] text-[1.8ch] font-semibold px-4 py-1 rounded-[12px] transition-colors whitespace-nowrap font-newblack'>
                Change
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}

/* ── FARM DROPDOWN COMPONENT ── */
function FarmDropdown({ label, value, options, onChange, color }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const base = 'max-w-full flex items-center gap-1 px-2 sm:px-3 py-2 rounded-[10px] text-xs sm:text-[1.6ch] font-semibold cursor-pointer select-none';

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        className={base}
        style={{ backgroundColor: color.bg, color: color.text }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>{label}: {value}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: color.text }}><FaCaretDown /></span>
      </button>

      {isOpen && (
        <div
          className='absolute left-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border p-1 shadow-[0_8px_22px_rgba(0,0,0,0.18)]'
          style={{
            backgroundColor: color.bg === '#192514' ? '#1F2D19' : '#F0FFE9',
            color: color.bg === '#192514' ? '#F8FFF6' : '#192514',
            borderColor: color.bg === '#192514' ? 'rgba(248,255,246,0.15)' : 'rgba(23,37,20,0.15)'
          }}
        >
          {(options || []).map((option) => (
            <button
              key={option}
              type='button'
              className='block w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors hover:bg-[rgba(214,247,203,0.22)]'
              onClick={() => {
                if (onChange) onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── PREFERENCE DROPDOWN COMPONENT ── */
function PrefDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const normalizedOptions = (options || []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option
  );

  const base = 'max-w-full flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-[1.5ch] font-semibold cursor-pointer select-none bg-[#DEDEDE] text-[#192514]';

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        className={base}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='capitalize'>{label}: {value}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><FaCaretDown /></span>
      </button>

      {isOpen && (
        <div className='absolute left-0 top-full mt-2 z-40 min-w-full w-max rounded-xl border border-[rgba(23,37,20,0.15)] bg-[#F4F6F4] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.14)]'>
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type='button'
              className='block w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors text-[#192514] hover:bg-[#DEDEDE]'
              onClick={() => {
                if (onChange) onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
