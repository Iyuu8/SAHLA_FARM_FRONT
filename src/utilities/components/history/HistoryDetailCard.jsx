import React from 'react'



const ActuatorCard = ({ actuator }) => {
  const { name, physical_state, control_mode, timer, delay } = actuator;
 
  const timingLabel = timer?.active
    ? "execute until"
    : delay?.active
    ? "execute at"
    : null;
 
  const timingValue = timer?.active
    ? timer.execute_until
    : delay?.active
    ? delay.execute_at
    : null;
 
  const duration = timer?.active && timer.duration_minutes
    ? `${timer.duration_minutes} min`
    : null;
 
  return (
    <div className={`flex-1 rounded-2xl md:p-4 p-2 ${ physical_state==="on" ? "bg-[#3F8806]" : "bg-[#192514]"}`}>
 
      {/* Name + mode */}
      <div className="flex items-center justify-between md:mb-3">
        <span className="font-normal font-newblack md:text-[24px] text-[15px] capitalize text-[#F8FFF6]">{name}:</span>
        <span className={`font-newblack md:px-3 px-1 py-0.5 rounded-full font-normal md:text-[14px] text-[8px] ${physical_state === "on" ? "bg-[#375F19] bg-opacity-80 text-[#AAE37F]" : "bg-[#25321F] bg-opacity-70 text-[#D1D1D1]"}`}>
          {control_mode}
        </span>
      </div>
      {/* ── Divider ── */}

      <div className="border-t border-[#E1E1E133] md:mb-5 mb-2" />  

      
    </div>
  );
};
export default function HistoryDetailCard({data,onClose,isMobile}) {
    const {
    date,
    time,
    crop,
    growthStage,
    weatherIcon,
    sensors,
    actuators = [],
    weatherSummary,
    aiRecommendation,
  } = data;
  console.log(data)
  return (
    <div className="bg-[#F5F7F4] rounded-3xl px-4 pb-2 md:p-7 max-w-2xl w-full shadow-md font-sans mx-auto relative">
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
      <div className={`py-2 md:py-5 flex md:gap-5 gap-3 items-center md:flex-row flex-col-reverse`}>
        <data.weatherIcon color={"#192514"} size={isMobile ? 150 : 200}/>
        <div>
            <p className='text-[#192514D4] font-newblack flex gap-2 md:text-[23px] text-[15px]'>
                <span>{date}</span>
                <span>at</span>
                <span>{time}</span>
            </p>
            <p className='text-[#295D00] font-newblack flex md:gap-5 gap-3 md:text-[23px] text-[15px]'>
                <span>{crop} in</span>
                <span>stage:</span>
                <span>{growthStage}</span>
            </p>
            <div className='text-[#333333] flex flex-col md:gap-3 gap-2'>
              {/* First row */}
              <div className='grid grid-cols-2 md:gap-6 gap-5'>
                <div className='w-full text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[10px] whitespace-nowrap'>
                  Temperature: {sensors.temperature}
                </div>
                <div className='w-full text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[10px] whitespace-nowrap'>
                  Humidity: {sensors.humidity}
                </div>
              </div>
              
              {/* Second row */}
              <div className='grid grid-cols-2 md:gap-6 gap-5'>
                <div className='w-full text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[10px] whitespace-nowrap'>
                  Soil moisture: {sensors.soilMoisture}
                </div>
                <div className='w-full text-[#333333] font-newblack bg-[#E0E0E0] border border-[#B4B4B4] md:px-3 px-2 py-2 md:py-3 rounded-lg text-center md:text-[16px] text-[10px] whitespace-nowrap'>
                  Light intensity: {sensors.lightIntensity}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ── Divider ── */}

      <div className="border-t border-[#1A3D008C] mb-5" />
      
      {/* ── Actuators ── */}
      
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[15px] md:h-[15px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <div className='font-newblack text-[#1A3D00] font-semibold md:text-[36px] text-[20px]'>Actuators</div>
        </div>
        {/* the pump and fan  */}
        <div className='flex gap-3'>
            {actuators.map((act, i) => (
            <ActuatorCard key={i} actuator={act}/>
          ))}
        </div>
      </div>
      {/* ── Weather Summary ── */}
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[15px] md:h-[15px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <div className='font-newblack text-[#1A3D00] font-semibold md:text-[36px] text-[20px]'>Weather Summary</div>
        </div>
        {/* Body */}
        <p
            className="font-newblack text-[#1A3D00E6] md:text-[21px] text-[13px]"
            dangerouslySetInnerHTML={{ __html: weatherSummary }}
        />
      </div>
      {/* ── SAHLA AI Recommendations ── */}
      <div>
        {/* title */}
        <div className='flex md:gap-2 gap-1 items-center'>
           <div className='w-[8px] h-[8px] md:w-[15px] md:h-[15px] bg-[#1A3D00] rounded-full md:mb-2 mb-1'></div>
            <div className='font-newblack text-[#1A3D00] font-semibold md:text-[36px] text-[18px]'>SAHLA AI . Recommendations</div>
        </div>
        {/* Body */}
        <p className='font-newblack text-[#1A3D00E6] md:text-[21px] text-[13px] '
            dangerouslySetInnerHTML={{ __html: aiRecommendation }} />
           
        
      </div>
      
    </div>
  )
}
