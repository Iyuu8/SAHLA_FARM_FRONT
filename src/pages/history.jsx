import React, { useState ,useEffect ,useRef} from 'react'
import { profileSettingOptions } from '../utilities/data/profileSettings';
import HistoryData from '../utilities/data/HistoryData';
import FarmDropdown from './../utilities/components/settings/FarmDropdown';

import HistoryDetailCard from '../utilities/components/history/HistoryDetailCard';
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 1.5H11.25V0.75C11.25 0.551088 11.171 0.360322 11.0303 0.21967C10.8897 0.0790176 10.6989 0 10.5 0C10.3011 0 10.1103 0.0790176 9.96967 0.21967C9.82902 0.360322 9.75 0.551088 9.75 0.75V1.5H5.25V0.75C5.25 0.551088 5.17098 0.360322 5.03033 0.21967C4.88968 0.0790176 4.69891 0 4.5 0C4.30109 0 4.11032 0.0790176 3.96967 0.21967C3.82902 0.360322 3.75 0.551088 3.75 0.75V1.5H2.25C1.65326 1.5 1.08097 1.73705 0.65901 2.15901C0.237053 2.58097 0 3.15326 0 3.75V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V3.75C15 3.15326 14.7629 2.58097 14.341 2.15901C13.919 1.73705 13.3467 1.5 12.75 1.5ZM13.5 12.75C13.5 12.9489 13.421 13.1397 13.2803 13.2803C13.1397 13.421 12.9489 13.5 12.75 13.5H2.25C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V7.5H13.5V12.75ZM13.5 6H1.5V3.75C1.5 3.55109 1.57902 3.36032 1.71967 3.21967C1.86032 3.07902 2.05109 3 2.25 3H3.75V3.75C3.75 3.94891 3.82902 4.13968 3.96967 4.28033C4.11032 4.42098 4.30109 4.5 4.5 4.5C4.69891 4.5 4.88968 4.42098 5.03033 4.28033C5.17098 4.13968 5.25 3.94891 5.25 3.75V3H9.75V3.75C9.75 3.94891 9.82902 4.13968 9.96967 4.28033C10.1103 4.42098 10.3011 4.5 10.5 4.5C10.6989 4.5 10.8897 4.42098 11.0303 4.28033C11.171 4.13968 11.25 3.94891 11.25 3.75V3H12.75C12.9489 3 13.1397 3.07902 13.2803 3.21967C13.421 3.36032 13.5 3.55109 13.5 3.75V6Z" fill="#55BB33"/>
  </svg>
);
 
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 7.63125L9.93749 9.31875C10.075 9.45625 10.1437 9.62825 10.1437 9.83475C10.1437 10.0412 10.075 10.2192 9.93749 10.3687C9.78749 10.5187 9.6095 10.5937 9.40349 10.5937C9.19749 10.5937 9.01925 10.5187 8.86874 10.3687L6.975 8.475C6.9 8.4 6.84375 8.31575 6.80625 8.22225C6.76875 8.12875 6.75 8.03175 6.75 7.93125V5.25C6.75 5.0375 6.822 4.8595 6.966 4.716C7.11 4.5725 7.288 4.5005 7.5 4.5C7.712 4.4995 7.89025 4.5715 8.03475 4.716C8.17925 4.8605 8.251 5.0385 8.25 5.25V7.63125ZM6.96525 2.78475C6.82175 2.64075 6.75 2.4625 6.75 2.25V1.5H8.25V2.25C8.25 2.4625 8.178 2.64075 8.034 2.78475C7.89 2.92875 7.712 3.0005 7.5 3C7.288 2.9995 7.11 2.9275 6.966 2.784M12.216 6.966C12.3595 6.822 12.5375 6.75 12.75 6.75H13.5V8.25H12.75C12.5375 8.25 12.3595 8.178 12.216 8.034C12.0725 7.89 12.0005 7.712 12 7.5C11.9995 7.288 12.0715 7.11 12.216 6.966ZM8.03475 12.216C8.17825 12.3595 8.25 12.5375 8.25 12.75V13.5H6.75V12.75C6.75 12.5375 6.822 12.3595 6.966 12.216C7.11 12.0725 7.288 12.0005 7.5 12C7.712 11.9995 7.89025 12.0715 8.03475 12.216ZM2.78475 8.03475C2.64075 8.17825 2.4625 8.25 2.25 8.25H1.5V6.75H2.25C2.4625 6.75 2.64075 6.822 2.78475 6.966C2.92875 7.11 3.0005 7.288 3 7.5C2.9995 7.712 2.92825 7.89025 2.78475 8.03475ZM7.5 15C6.4625 15 5.4875 14.803 4.575 14.409C3.6625 14.015 2.86875 13.4807 2.19375 12.8062C1.51875 12.1317 0.9845 11.338 0.591001 10.425C0.197501 9.512 0.000500949 8.537 9.49366e-07 7.5C-0.00049905 6.463 0.196501 5.488 0.591001 4.575C0.9855 3.662 1.51975 2.86825 2.19375 2.19375C2.86775 1.51925 3.6615 0.985 4.575 0.591C5.4885 0.197 6.4635 0 7.5 0C8.5365 0 9.51149 0.197 10.425 0.591C11.3385 0.985 12.1322 1.51925 12.8062 2.19375C13.4802 2.86825 14.0147 3.662 14.4097 4.575C14.8047 5.488 15.0015 6.463 15 7.5C14.9985 8.537 14.8015 9.512 14.409 10.425C14.0165 11.338 13.4822 12.1317 12.8062 12.8062C12.1302 13.4807 11.3365 14.0152 10.425 14.4097C9.51349 14.8042 8.5385 15.001 7.5 15ZM13.5 7.5C13.5 5.825 12.9187 4.40625 11.7562 3.24375C10.5937 2.08125 9.17499 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5937 3.24375 11.7562C4.40625 12.9187 5.825 13.5 7.5 13.5C9.17499 13.5 10.5937 12.9187 11.7562 11.7562C12.9187 10.5937 13.5 9.175 13.5 7.5Z" fill="#1A3D00" fillOpacity="0.73"/>
  </svg>
);
 
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
export default function History() {
  const [Input,setInput]=useState({
    date:"",
    time:"",
    crop:"",
    growthStage:"All",
    weather:"All"
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  const {growthStageOptions} = profileSettingOptions;
  function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
}
  const isMobile = useIsMobile();
  const FilteredHistoryData = HistoryData.filter((p)=>{
    const dateMatch = Input.date === "" || p.date.includes(Input.date);
    const timeMatch = Input.time === "" || p.time.includes(Input.time);
    const cropMatch = Input.crop === "" || p.crop.toLowerCase().includes(Input.crop.toLowerCase());
    const stageMatch = Input.growthStage === "All" || p.growthStage.toLowerCase() === Input.growthStage.toLowerCase();
    const weatherMatch = Input.weather === "All" || p.weather.toLowerCase() === Input.weather.toLowerCase();
    return dateMatch && timeMatch && cropMatch && stageMatch && weatherMatch;
  })

  return (
    <div className='flex flex-col h-full max-h-full overflow-hidden md:p-3 p-1 gap-4 w-full'>
      <div className='flex flex-wrap justify-between gap-3 flex-none'>
        <div  className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>Date</label>
          <input className='bg-white rounded-lg hover:border-[#55BB33] border-[#C0C5D0] border-1 text-[10px] md:text-[16px] border outline-none px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33]' placeholder='e.g. 13-02-26 ' 
            value={Input.date} onChange={(e)=> setInput({...Input,date:e.target.value})}/>
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>Time</label>
          <input className='bg-white rounded-lg hover:border-[#55BB33] border-[#C0C5D0] border-1 text-[10px] md:text-[16px] border outline-none px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33]' placeholder='e.g. 13:00 '
           value={Input.time} onChange={(e)=> setInput({...Input,time:e.target.value})}/>
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>Crop</label>
          <input className='bg-white rounded-lg hover:border-[#55BB33] border-[#C0C5D0] text-[10px] md:text-[16px] border-1 border outline-none px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33]' placeholder='e.g. orange'
           value={Input.crop} onChange={(e)=> setInput({...Input,crop:e.target.value})}/>
        </div>
        
        <div className="flex flex-col flex-1 md:min-w-[150px] min-w-[80px]">
                <span className="font-newblack font-bold text-black/70 text-[10px] md:text-[16px]">Growth Stage</span>
                <CustomDropdown
                  value={Input.growthStage}
                  onChange={(val) => setInput({...Input, growthStage: val})}
                  options={["All", ...growthStageOptions] || []}
                  placeholder="Select growth stage"
                />
                {/* <select 
                  value={Input.growthStage}
                  onChange={(e) => setInput({...Input,growthStage:e.target.value})}
                  className="bg-white rounded-lg text-[10px] md:text-[16px] hover:border-[#55BB33] border-[#C0C5D0] border-1 border outline-none px-2 py-[5px] hover:shadow-[0_0_4px_0_#55BB33]"
                >
                  <option>All</option>

                  <option>flowering</option>
                  <option>Fruiting</option>
                  <option>Maturity</option>
                  <option>vegetative Growth</option>
                  <option>Germination</option>
                  <option>seedling</option>
                </select>  */}



        </div>
        
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
                <span className="font-newblack font-bold text-black/70 text-[10px] md:text-[16px]">Weather</span>
                <CustomDropdown
                  value={Input.weather}
                  onChange={(val) => setInput({...Input, weather: val})}
                  options={["All","Sunny","Cloudy","night","windy","stormy","rainy"] || []}
                  placeholder="Select growth stage"
                />
                {/* <select 
                  value={Input.weather}
                  onChange={(e) => setInput({...Input,weather:e.target.value})}
                  className="bg-white rounded-lg hover:border-[#55BB33] border-[#C0C5D0] border-1 text-[10px] md:text-[16px] border outline-none px-2 py-[5px] hover:shadow-[0_0_4px_0_#55BB33]"
                >
                  <option>All</option>
                  <option>Sunny</option>
                  <option>Cloudy</option>
                </select> */}
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px] bg-[#192514]
         text-[#E8FFE0] text-[10px] md:text-[16px] items-center justify-center self-end
          h-fit md:py-[5px] py-[6px] rounded-lg cursor-pointer' 
          onClick={()=> setInput({
            date:"",
            time:"",
            crop:"",
            growthStage:"All",
            weather:"All"})}>
          RESET
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 w-full rounded-xl  overflow-hidden bg-white">
      {/* Header Row - Now Sticky */}
      <div className="grid grid-cols-5 bg-[#192514] border-b-2 border-[#57BD36] sticky top-0 z-10">
        {["Date", "Time", "Crop", "Growth Stage", "Weather"].map((header) => (
          <div key={header} className="text-[#E8FFE0] font-bold py-4 text-center text-[10px] md:text-[16px] uppercase tracking-wider">
            {header}
          </div>
        ))}
      </div>

      {/* Body Rows */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white custom-scrollbar">
        {FilteredHistoryData.map((item) => (
          <div 
            key={item.id} 
            className={`grid grid-cols-5 items-center border-b border-[#bdbdbd7c] transition-colors duration-200 hover:bg-[#B0FF92] hover:bg-opacity-40 cursor-pointer
            `}
            onClick={() => handleItemClick(item)}
          >
            {/* Date */}
            <div className="py-4 font-bold text-center text-[#00000094] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px] ">
              <CalendarIcon/> {item.date}
            </div>

            {/* Time */}
            <div className="py-4 font-bold text-center text-[#1A3D00BA] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px]">
              <ClockIcon/> {item.time}
            </div>

            {/* Crop */}
            <div className="py-4 text-center font-bold text-[#192514] relative text-[10px] md:text-[16px]">
              {item.crop} 
            </div>

            {/* Growth Stage */}
            <div className="py-4 text-center text-[#2E6900] font-semibold capitalize text-[10px] md:text-[16px]">
              {item.growthStage}
            </div>

            {/* Weather */}
            <div className="py-4 mx-auto">
              <item.weatherIcon color={"#192514"} size={isMobile ? 15 : undefined} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-[#1A3D00] font-bold bg-white text-sm">
        loading more records...
      </div>
    </div>
    {/* Modal Overlay */}
    {/* Modal */}
    {showModal && selectedItem && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <div 
          className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <HistoryDetailCard data={selectedItem.details} onClose={closeModal} isMobile={isMobile}/>
        </div>
      </div>
    )}
    </div>
  )
}



const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main select button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-lg text-[10px] md:text-[16px] hover:border-[#55BB33] border-2 border-[#C0C5D0] outline-none md:px-4 px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33] cursor-pointer flex justify-between items-center transition-all duration-200"
      >
        <span className={!selectedOption ? 'text-gray-400' : 'text-gray-700'}>
          {selectedOption || placeholder || 'Select option'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Custom dropdown list - WITH CUSTOM BORDER, SHADOW, AND NO SCROLLBAR */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_0_8px_#4b53489c] z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto hide-scrollbar">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`
                  px-4 py-2.5 cursor-pointer transition-all duration-200 text-[10px] md:text-[16px]
                  ${value === option 
                    ? 'bg-[#55BB33] text-white font-medium' 
                    : 'text-gray-700 hover:bg-[rgba(176,255,146,0.49)] hover:text-[#000000]'
                  }
                  border-b border-gray-100 last:border-b-0
                `}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};