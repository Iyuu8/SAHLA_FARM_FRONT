import React from 'react'
import { TemperatureIcon , LightIcon , HumidityIcon , SoilMoistureIcon } from '../../data/Icons';
import {
  convertHumidity,
  convertLightIntensity,
  convertSoilMoisture,
  convertTemperature,
  formatConvertedValue,
  splitReading,
} from '../../functions/conversionFunctions';
import { useTranslation } from 'react-i18next';


const ActuatorCard = ({ actuator }) => {
  const { type, status, control_mode, run_at, run_until } = actuator;
  const { t } = useTranslation();

  // Format time from ISO string to "HH:MM"
  const formatTime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Get timing display
  const getTimingDisplay = () => {
    const startTime = run_at ? formatTime(run_at) : null;
    const endTime = run_until ? formatTime(run_until) : null;
    
    if (control_mode === "auto") {
      // Auto mode
      if (startTime && endTime) {
        return (
          <div className="flex flex-col md:gap-1  flex-wrap">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.plannedFrom')}</span>
            <p>
              <span className=" text-white font-bold text-[11px] md:text-[16px]">{startTime}</span>
              <span className='text-white font-extrabold text-[13px] md:text-[20px]'> → </span>
              <span className="text-white font-bold text-[11px] md:text-[16px]">{endTime}</span>
            </p>
            
          </div>
        );
      } else if (startTime) {
        return (
          <div className="flex flex-col md:gap-1 ">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.plannedAt')}</span>
            <span className="font-bold text-white text-[11px] md:text-[16px]">{startTime}</span>
          </div>
        );
      } else if (endTime) {
        return (
          <div className="flex flex-col md:gap-1 ">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.plannedUntil')}</span>
            <span className="font-bold text-white text-[11px] md:text-[16px]">{endTime}</span>
          </div>
        );
      }else {
        // Fallback for Auto mode with no time
        return (
          <div className="flex flex-col md:gap-1">
            <span className={`text-[10px] md:text-[14px] opacity-80 ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>
              {t('history.actuatorCard.noPlannedTime')}
            </span>
          </div>
        );
      }
    } else if (control_mode === "semi_auto") {
      // Semi-auto mode
      if (startTime && endTime) {
        return (
          <div className="flex flex-col md:gap-1 flex-wrap">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.suggestedFrom')}</span>
            <p>
              <span className="font-bold text-white  text-[11px] md:text-[16px]">{startTime}</span>
              <span className='text-white  font-extrabold text-[13px] md:text-[20px]'> → </span>
              <span className="font-bold text-white  text-[11px] md:text-[16px]"> {endTime}</span>
            </p>
            
          </div>
        );
      } else if (startTime) {
        return (
          <div className="flex flex-col md:gap-1">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.suggestedAt')}</span>
            <span className="font-bold text-white text-[11px] md:text-[16px]">{startTime}</span>
          </div>
        );
      } else if (endTime) {
        return (
          <div className="flex flex-col md:gap-1">
            <span className={`text-[10px] md:text-[14px] ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>{t('history.actuatorCard.suggestedUntil')}</span>
            <span className="font-bold text-white text-[11px] md:text-[16px]">{endTime}</span>
          </div>
        );
      }
      else {
        // Fallback for Semi-Auto mode with no time
        return (
          <div className="flex flex-col md:gap-1">
            <span className={`text-[10px] md:text-[14px] opacity-80 ${status === "on" ? "text-[#E1F9CF]" : "text-white"}`}>
              {t('history.actuatorCard.noSuggestedTime')}
            </span>
          </div>
        );
      }
    }
    
    return null;
  };

  const timingDisplay = getTimingDisplay();
  const hasTimingInfo = timingDisplay;
  return (
    <div className={`flex-1 rounded-2xl mb-2 md:py-3 md:px-4 p-2 ${ status ==="on" ? "bg-[#3F8806]" : "bg-[#192514]"}`}>
 
      {/* Name + mode */}
      <div className="flex items-center justify-between md:mb-1">
        <span className="font-normal font-newblack md:text-[24px] text-[15px] capitalize text-[#F8FFF6]">{t(`history.historyCard.${type}`)} :</span>
        <span className={`font-newblack md:px-3 px-1 py-0.5 rounded-full font-normal md:text-[14px] text-[8px] ${status === "on" ? "bg-[#375F19] bg-opacity-80 text-[#AAE37F]" : "bg-[#25321F] bg-opacity-70 text-[#D1D1D1]"}`}>
          {t(`dashboard.editActuators.modes.${control_mode}`)}
        </span>
      </div>
      {/* ── Divider ── */}

      <div className="border-t border-[#E1E1E133] md:mb-2 mb-2" />  
      {/* Timing Information */}
      {hasTimingInfo && (
        <div className="">
          {timingDisplay }
        </div>
      )}
      
    </div>
  );
};
export default function HistoryDetailCard({
  data,
  onClose,
  isMobile,
  temperatureUnit = '°C',
  humidityUnit = '%',
  soilMoistureUnit = '%',
  lightIntensityUnit = 'lux',
}) {
    const { t } = useTranslation();
    const {
    date,
    time,
    crop,
    growthStage,
    sensors,
    actuators = [],
    weatherSummary,
    aiRecommendation,
  } = data;
  console.log(actuators);
  const parsedTemperature = splitReading(sensors.temperature);
  const parsedHumidity = splitReading(sensors.humidity);
  const parsedSoil = splitReading(sensors.soilMoisture);
  const parsedLight = splitReading(sensors.lightIntensity);

  const tempInC = Number.isFinite(parsedTemperature.value) ? parsedTemperature.value : 0;

  const convertedSensors = {
    temperature: formatConvertedValue(convertTemperature(tempInC, temperatureUnit), temperatureUnit, 1),
    humidity: formatConvertedValue(
      convertHumidity(parsedHumidity.value, humidityUnit, tempInC),
      humidityUnit,
      1
    ),
    soilMoisture: formatConvertedValue(
      convertSoilMoisture(parsedSoil.value, soilMoistureUnit),
      soilMoistureUnit,
      1
    ),
    lightIntensity: formatConvertedValue(
      convertLightIntensity(parsedLight.value, lightIntensityUnit),
      lightIntensityUnit,
      1
    ),
  };

  return (
    <div className="bg-[#F5F7F4] rounded-3xl px-4 pb-5 md:px-7 max-w-2xl w-full shadow-md font-sans mx-auto relative overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Close Button - Inside Card */}
      <button
        onClick={onClose}
        className=" bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors absolute md:right-4 md:top-4 right-2 top-2 "
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-gray-600"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>   
      <div className={`py-3 md:py-2 flex md:gap-5 items-center md:flex-row `}>
        {!isMobile && <data.weatherIcon color={"#192514"} size={200}/>}
        <div className='w-full'>
            <div className='flex gap-4 md:gap-0'>
                {isMobile && <data.weatherIcon color={"#192514"} size={40}/>}
            <div>
              <p className='text-[#192514D4] font-newblack flex gap-2 md:text-[22px] text-[15px]'>
                <span>{date}</span>
                <span>{t('history.historyCard.at')}</span>
                <span>{time}</span>
              </p>
              <p className='text-[#295D00] font-newblack flex md:gap-3 gap-3 md:text-[22px] text-[15px] '>
                  <span>{crop} {t('history.historyCard.in')}</span>
                  <span>{t('history.historyCard.stage')}</span>
                  <span className=''>{t(`history.growth_stages.${growthStage}`)}</span>
              </p>
            </div>
            </div>
            
            
            <div className='text-[#333333] flex flex-col md:gap-3 gap-2'>
              {/* First row */}
              <div className='grid grid-cols-2 md:gap-6 gap-5'>
                <div className='flex w-full items-center gap-2 text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[14px] whitespace-nowrap'>
                  <TemperatureIcon size={isMobile ? 30 : 24 }/><div className='flex flex-col-reverse items-start md:flex-row'><span>{t('history.historyCard.sensors.temperature')}</span><span className='font-bold text-[16px] md:font-normal'>{!isMobile && <span>:</span>} {convertedSensors.temperature}</span> </div>
                </div>
                <div className='flex w-full items-center gap-2 text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[14px] whitespace-nowrap'>
                  <HumidityIcon size={isMobile ? 30 : 24 }/><div className='flex flex-col-reverse items-start md:flex-row'><span>{t('history.historyCard.sensors.humidity')}</span><span className='font-bold text-[16px] md:font-normal'>{!isMobile && <span>:</span>} {convertedSensors.humidity}</span> </div>
                </div>
              </div>
              {/* Second row */}
              <div className='grid grid-cols-2 md:gap-6 gap-4'>
                <div className='flex w-full items-center gap-2 text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[14px] whitespace-nowrap'>
                  <SoilMoistureIcon size={isMobile ? 30 : 24 }/><div className='flex flex-col-reverse items-start md:flex-row'><span>{t('history.historyCard.sensors.soilMoisture')}</span><span className='font-bold text-[16px] md:font-normal'>{!isMobile && <span>:</span>} {convertedSensors.soilMoisture}</span> </div>
                </div>
                <div className='flex w-full items-center gap-2 text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[14px] whitespace-nowrap'>
                  <LightIcon size={isMobile ? 30 : 24 }/><div className='flex flex-col-reverse items-start md:flex-row'><span>{t('history.historyCard.sensors.lightIntensity')}</span><span className='font-bold text-[16px] md:font-normal'>{!isMobile && <span>:</span>} {convertedSensors.lightIntensity}</span> </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ── Divider ── */}

      <div className="border-t border-[#1A3D008C] mb-2" />
      
      {/* ── Actuators ── */}
      
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[12px] md:h-[12px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <div className='font-newblack text-[#1A3D00] font-semibold md:text-[30px] text-[18px]'>{t('history.historyCard.sections.actuators')}</div>
        </div>
        {/* the pump and fan  */}
        <div className='flex flex-col md:flex-row gap-3'>
            {actuators.map((act, i) => (
            <ActuatorCard key={i} actuator={act}/>
          ))}
        </div>
      </div>
      {/* ── Weather Summary ── */}
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[12px] md:h-[12px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <p className='font-newblack text-[#1A3D00] font-semibold md:text-[30px] text-[18px]'>{t('history.historyCard.sections.weatherSummary')}</p>
        </div>
        {/* Body */}
        <p
            className="font-newblack text-[#1A3D00E6] md:text-[17px] text-[13px]"
            dangerouslySetInnerHTML={{ __html: weatherSummary }}
        />
      </div>
      {/* ── SAHLA AI Recommendations ── */}
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[12px] md:h-[12px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <p className='font-newblack text-[#1A3D00] font-semibold md:text-[30px] text-[18px]'>{t('history.historyCard.sections.aiRecommendations')}</p>
        </div>
        {/* Body */}
        <p className='font-newblack text-[#1A3D00E6] md:text-[17px] text-[13px] '
            dangerouslySetInnerHTML={{ __html: aiRecommendation }} />
           
        
      </div>
      
    </div>
  )
}
