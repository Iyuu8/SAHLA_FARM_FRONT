import React, { useState, useEffect, useRef } from 'react'
import { profileSettingOptions } from '../utilities/data/profileSettings'
import { useTranslation } from 'react-i18next';
import { translateText } from '../utilities/functions/translateText';
import { normalizeArabic } from '../utilities/functions/normalizeArabic';
import { SunnyIcon, ClearNightIcon, CloudyIcon, HeavyRainIcon, HeavyRainAltIcon, WindyIcon } from '../utilities/data/Icons'
import HistoryDetailCard from '../utilities/components/history/HistoryDetailCard';
import DynamicTranslator from '../utilities/components/Translation/DynamicTranslator';
import useHistory from '../hooks/useHistory'
import useHistoryDetail from '../hooks/useHistoryDetail'
import HACredentialsRequired from './haCredentialsRequired'

const weatherIconMap = {
  sunny: SunnyIcon,
  cloudy: CloudyIcon,
  rainy: HeavyRainAltIcon,
  stormy: HeavyRainIcon,
  windy: WindyIcon,
  night: ClearNightIcon,
}

const CalendarIcon = ({ size = 15, color = "#55BB33" }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 1.5H11.25V0.75C11.25 0.551088 11.171 0.360322 11.0303 0.21967C10.8897 0.0790176 10.6989 0 10.5 0C10.3011 0 10.1103 0.0790176 9.96967 0.21967C9.82902 0.360322 9.75 0.551088 9.75 0.75V1.5H5.25V0.75C5.25 0.551088 5.17098 0.360322 5.03033 0.21967C4.88968 0.0790176 4.69891 0 4.5 0C4.30109 0 4.11032 0.0790176 3.96967 0.21967C3.82902 0.360322 3.75 0.551088 3.75 0.75V1.5H2.25C1.65326 1.5 1.08097 1.73705 0.65901 2.15901C0.237053 2.58097 0 3.15326 0 3.75V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H12.75C13.3467 15 13.919 14.7629 14.341 14.341C14.7629 13.919 15 13.3467 15 12.75V3.75C15 3.15326 14.7629 2.58097 14.341 2.15901C13.919 1.73705 13.3467 1.5 12.75 1.5ZM13.5 12.75C13.5 12.9489 13.421 13.1397 13.2803 13.2803C13.1397 13.421 12.9489 13.5 12.75 13.5H2.25C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V7.5H13.5V12.75ZM13.5 6H1.5V3.75C1.5 3.55109 1.57902 3.36032 1.71967 3.21967C1.86032 3.07902 2.05109 3 2.25 3H3.75V3.75C3.75 3.94891 3.82902 4.13968 3.96967 4.28033C4.11032 4.42098 4.30109 4.5 4.5 4.5C4.69891 4.5 4.88968 4.42098 5.03033 4.28033C5.17098 4.13968 5.25 3.94891 5.25 3.75V3H9.75V3.75C9.75 3.94891 9.82902 4.13968 9.96967 4.28033C10.1103 4.42098 10.3011 4.5 10.5 4.5C10.6989 4.5 10.8897 4.42098 11.0303 4.28033C11.171 4.13968 11.25 3.94891 11.25 3.75V3H12.75C12.9489 3 13.1397 3.07902 13.2803 3.21967C13.421 3.36032 13.5 3.55109 13.5 3.75V6Z" fill={color} />
  </svg>
)

const ClockIcon = ({ size = 15, color = "#1A3D00", opacity = 0.73 }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 7.63125L9.93749 9.31875C10.075 9.45625 10.1437 9.62825 10.1437 9.83475C10.1437 10.0412 10.075 10.2192 9.93749 10.3687C9.78749 10.5187 9.6095 10.5937 9.40349 10.5937C9.19749 10.5937 9.01925 10.5187 8.86874 10.3687L6.975 8.475C6.9 8.4 6.84375 8.31575 6.80625 8.22225C6.76875 8.12875 6.75 8.03175 6.75 7.93125V5.25C6.75 5.0375 6.822 4.8595 6.966 4.716C7.11 4.5725 7.288 4.5005 7.5 4.5C7.712 4.4995 7.89025 4.5715 8.03475 4.716C8.17925 4.8605 8.251 5.0385 8.25 5.25V7.63125ZM7.5 15C6.4625 15 5.4875 14.803 4.575 14.409C3.6625 14.015 2.86875 13.4807 2.19375 12.8062C1.51875 12.1317 0.9845 11.338 0.591001 10.425C0.197501 9.512 0.000500949 8.537 9.49366e-07 7.5C-0.00049905 6.463 0.196501 5.488 0.591001 4.575C0.9855 3.662 1.51975 2.86825 2.19375 2.19375C2.86775 1.51925 3.6615 0.985 4.575 0.591C5.4885 0.197 6.4635 0 7.5 0C8.5365 0 9.51149 0.197 10.425 0.591C11.3385 0.985 12.1322 1.51925 12.8062 2.19375C13.4802 2.86825 14.0147 3.662 14.4097 4.575C14.8047 5.488 15.0015 6.463 15 7.5C14.9985 8.537 14.8015 9.512 14.409 10.425C14.0165 11.338 13.4822 12.1317 12.8062 12.8062C12.1302 13.4807 11.3365 14.0152 10.425 14.4097C9.51349 14.8042 8.5385 15.001 7.5 15ZM13.5 7.5C13.5 5.825 12.9187 4.40625 11.7562 3.24375C10.5937 2.08125 9.17499 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5937 3.24375 11.7562C4.40625 12.9187 5.825 13.5 7.5 13.5C9.17499 13.5 10.5937 12.9187 11.7562 11.7562C12.9187 10.5937 13.5 9.175 13.5 7.5Z" fill={color} fillOpacity={opacity} />
  </svg>
)

function DatePicker({ value, onChange }) {
  const { t } = useTranslation()
  const MONTHS = [t('history.months.january'), t('history.months.february'), t('history.months.march'), t('history.months.april'), t('history.months.may'), t('history.months.june'), t('history.months.july'), t('history.months.august'), t('history.months.september'), t('history.months.october'), t('history.months.november'), t('history.months.december')]
  const DAY_NAMES = [t('history.days.su'), t('history.days.mo'), t('history.days.tu'), t('history.days.we'), t('history.days.th'), t('history.days.fr'), t('history.days.sa')]
  const [isOpen, setIsOpen] = useState(false)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const ref = useRef(null)
  const pad = (n) => String(n).padStart(2, "0")
  const today = new Date()
  const selectedDate = value ? (() => { const [d, m, y] = value.split("-"); return { y: +`20${y}`, m: +m - 1, d: +d } })() : null
  const displayValue = value || null
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])
  const changeMonth = (dir) => { let m = viewMonth + dir, y = viewYear; if (m > 11) { m = 0; y++ } if (m < 0) { m = 11; y-- } setViewMonth(m); setViewYear(y) }
  const changeYear = (dir) => setViewYear((y) => y + dir)
  const pickDay = (d) => { const yy = String(viewYear).slice(-2); onChange(`${pad(d)}-${pad(viewMonth + 1)}-${yy}`); setIsOpen(false) }
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()
  return (
    <div className="relative w-full" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className={`bg-white rounded-lg border-2 outline-none cursor-pointer flex justify-between items-center transition-all duration-200 px-2 py-1 text-[10px] md:text-[16px] ${isOpen ? "border-[#55BB33] shadow-[0_0_4px_0_#55BB33]" : "border-[#C0C5D0] hover:border-[#55BB33] hover:shadow-[0_0_4px_0_#55BB33]"}`}>
        <span className={!displayValue ? "text-gray-400" : "text-gray-700"}>{displayValue || t('history.placeholders.date')}</span>
        <svg className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1.5 md:mt-2 bg-white rounded-xl shadow-[0_0_8px_#4b53489c] z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-1.5 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2">
            <button onClick={() => changeMonth(-1)} className="rounded hover:bg-[rgba(176,255,146,0.49)] text-gray-600 leading-none px-1 text-xs md:text-sm lg:text-base">‹</button>
            <div className="flex items-center gap-0.5">
              <button onClick={() => changeYear(-1)} className="rounded hover:bg-[rgba(176,255,146,0.49)] text-gray-400 leading-none px-0.5 text-[7px] md:text-[9px] lg:text-[10px]">▲</button>
              <span className="font-semibold text-gray-700 text-center whitespace-nowrap text-[8px] md:text-[11px] lg:text-[13px]">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={() => changeYear(1)} className="rounded hover:bg-[rgba(176,255,146,0.49)] text-gray-400 leading-none px-0.5 text-[7px] md:text-[9px] lg:text-[10px]">▼</button>
            </div>
            <button onClick={() => changeMonth(1)} className="rounded hover:bg-[rgba(176,255,146,0.49)] text-gray-600 leading-none px-1 text-xs md:text-sm lg:text-base">›</button>
          </div>
          <div className="p-1 md:p-1.5 lg:p-2">
            <div className="grid grid-cols-7">{DAY_NAMES.map((n) => (<div key={n} className="text-center font-semibold text-gray-400 text-[6px] py-0.5 md:text-[8px] md:py-1 lg:text-[9px]">{n}</div>))}</div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }, (_, i) => (<div key={`prev-${i}`} className="text-center text-gray-300 text-[7px] py-0.5 md:text-[10px] md:py-1 lg:text-[11px]">{prevMonthDays - firstDay + 1 + i}</div>))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1
                const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                const isSelected = selectedDate && selectedDate.d === d && selectedDate.m === viewMonth && selectedDate.y === viewYear
                return (<div key={d} onClick={() => pickDay(d)} className={`text-center rounded cursor-pointer transition-all duration-150 text-[7px] py-0.5 md:text-[10px] md:py-1 lg:text-[11px] lg:py-1.5 ${isSelected ? "bg-[#55BB33] text-white font-medium" : isToday ? "font-bold text-[#55BB33] hover:bg-[rgba(176,255,146,0.49)]" : "text-gray-700 hover:bg-[rgba(176,255,146,0.49)]"}`}>{d}</div>)
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TimePicker({ value, onChange }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const pad = (n) => String(n).padStart(2, "0")
  const selHour = value ? +value.split(":")[0] : null
  const selMin = value ? +value.split(":")[1] : null
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])
  const pick = (type, val) => { const h = type === "h" ? val : (selHour ?? 0); const m = type === "m" ? val : (selMin ?? 0); onChange(`${pad(h)}:${pad(m)}`); if (type === "m") setIsOpen(false) }
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)
  return (
    <div className="relative w-full" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className={`bg-white rounded-lg text-[10px] md:text-[16px] border-2 outline-none md:px-4 px-2 py-1 cursor-pointer flex justify-between items-center transition-all duration-200 ${isOpen ? "border-[#55BB33] shadow-[0_0_4px_0_#55BB33]" : "border-[#C0C5D0] hover:border-[#55BB33] hover:shadow-[0_0_4px_0_#55BB33]"}`}>
        <span className={!value ? "text-gray-400" : "text-gray-700"}>{value || t('history.placeholders.time')}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_0_8px_#4b53489c] z-50 overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="border-r border-gray-100">
              <div className="text-[9px] text-gray-400 font-semibold text-center py-2 bg-gray-50 border-b border-gray-100 tracking-widest">{t('history.timepicker.hour')}</div>
              <div className="max-h-48 overflow-y-auto hide-scrollbar">{hours.map((h) => (<div key={h} onClick={() => pick("h", h)} className={`px-4 py-2.5 cursor-pointer transition-all duration-150 text-[10px] md:text-[16px] text-center border-b border-gray-100 last:border-b-0 ${selHour === h ? "bg-[#55BB33] text-white font-medium" : "text-gray-700 hover:bg-[rgba(176,255,146,0.49)]"}`}>{pad(h)}</div>))}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-semibold text-center py-2 bg-gray-50 border-b border-gray-100 tracking-widest">{t('history.timepicker.min')}</div>
              <div className="max-h-48 overflow-y-auto hide-scrollbar">{minutes.map((m) => (<div key={m} onClick={() => pick("m", m)} className={`px-4 py-2.5 cursor-pointer transition-all duration-150 text-[10px] md:text-[16px] text-center border-b border-gray-100 last:border-b-0 ${selMin === m ? "bg-[#55BB33] text-white font-medium" : "text-gray-700 hover:bg-[rgba(176,255,146,0.49)]"}`}>{pad(m)}</div>))}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const selectedOption = options.find(opt => opt === value)
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="bg-white rounded-lg text-[10px] md:text-[16px] hover:border-[#55BB33] border-2 border-[#C0C5D0] outline-none md:px-4 px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33] cursor-pointer flex justify-between items-center transition-all duration-200">
        <span className={!selectedOption ? 'text-gray-400' : 'text-gray-700'}>{selectedOption || placeholder || 'Select option'}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_0_8px_#4b53489c] z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto hide-scrollbar">
            {options.map((option) => (
              <div key={option} onClick={() => { onChange(option); setIsOpen(false) }} className={`px-4 py-2.5 cursor-pointer transition-all duration-200 text-[10px] md:text-[16px] ${value === option ? 'bg-[#55BB33] text-white font-medium' : 'text-gray-700 hover:bg-[rgba(176,255,146,0.49)] hover:text-[#000000]'} border-b border-gray-100 last:border-b-0`}>{option}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

  

  

  
export default function History({ temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit }) {
  const { t, i18n } = useTranslation();
  const { history, loading, error, hasMore, loadMore, refresh } = useHistory()
  const { detail, loading: detailLoading, error: detailError, fetchDetail } = useHistoryDetail()
  const [Input, setInput] = useState({
    date: "",
    time: "",
    crop: "",
    growthStage: t('history.growth_stages.all'),
    weather: t('history.options.all'),
  });
  const [showModal, setShowModal] = useState(false)
  const growthStageOptions = [
    t('history.growth_stages.all'),
    t('history.growth_stages.seedling'),
    t('history.growth_stages.vegetative_growth'),
    t('history.growth_stages.flowering'),
    t('history.growth_stages.fruiting'),
    t('history.growth_stages.maturity'),
  ];

  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint)
    useEffect(() => {
      const handler = () => setIsMobile(window.innerWidth < breakpoint)
      window.addEventListener("resize", handler)
      return () => window.removeEventListener("resize", handler)
    }, [breakpoint])
    return isMobile
  }
  const isMobile = useIsMobile()
  const [FilteredHistoryData, setFilteredHistoryData] = useState(history);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => { refresh() }, [])

  const handleItemClick = async (item) => {
    setShowModal(true)
    await fetchDetail(item.id)
  }

  if (error && (error.includes('credentials') || error.includes('farm') || error.includes('Farm') || error.includes('token'))) {
    return <HACredentialsRequired />
  }
  const formatWithUnderscores = (text) => {
    if (!text) return "";
    return text.trim().toLowerCase().split(/\s+/).join('_');
  };

  const formatToCamelCase = (text) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  };
  // ── Async filtering ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const runFilter = async () => {
      const results = await Promise.all(
        history.map(async (p) => {
          const dateMatch = Input.date === "" || p.date.includes(Input.date);
          const timeMatch = Input.time === "" || p.time.includes(Input.time);
          const translatedCrop = await translateText(p.crop, i18n.language);
          const cropInputMatch =
            Input.crop.toLowerCase() === "" ||
            normalizeArabic(translatedCrop).includes(normalizeArabic(Input.crop));
          const stageMatch =
            Input.growthStage === t('history.growth_stages.all') ||
            t(`history.growth_stages.${formatWithUnderscores(p.growthStage.toLowerCase())}`) === Input.growthStage.toLowerCase();
          const weatherMatch =
            Input.weather === t('history.options.all') ||
            t(`history.options.${p.weather.toLowerCase()}`) === Input.weather.toLowerCase();

          return { p, matches: dateMatch && timeMatch && cropInputMatch && stageMatch && weatherMatch };
        })
      );

      if (!cancelled) {
        setFilteredHistoryData(results.filter((r) => r.matches).map((r) => r.p));
      }
    };

    runFilter();

    return () => { cancelled = true; };
  }, [Input, i18n.language]);

  return (
    <div className='flex flex-col h-full max-h-full overflow-hidden md:p-3 p-1 gap-4 w-full'>
      {/* ── Filters ── */}
      <div className='flex flex-wrap justify-between gap-3 flex-none'>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>{t('history.labels.date')}</label>
          <DatePicker value={Input.date} onChange={(v) => setInput({ ...Input, date: v })} />
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>{t('history.labels.time')}</label>
          <TimePicker value={Input.time} onChange={(v) => setInput({ ...Input, time: v })} />
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
          <label className='font-newblack font-bold text-black/70 text-[10px] md:text-[16px]'>{t('history.labels.crop')}</label>
          <input className='bg-white rounded-lg hover:border-[#55BB33] border-[#C0C5D0] text-[10px] md:text-[16px] border-1 border outline-none px-2 py-1 hover:shadow-[0_0_4px_0_#55BB33]' placeholder={t('history.placeholders.crop')} type="text" value={Input.crop} onChange={(e) => setInput({ ...Input, crop: e.target.value })} />
        </div>
        <div className="flex flex-col flex-1 md:min-w-[150px] min-w-[80px]">
          <span className="font-newblack font-bold text-black/70 text-[10px] md:text-[16px]">{t('history.labels.growth_stage')}</span>
          <CustomDropdown value={Input.growthStage} onChange={(val) => setInput({ ...Input, growthStage: val })} options={[t('history.growth_stages.all'), ...growthStageOptions]} placeholder="Select growth stage" />
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px]'>
                <span className="font-newblack font-bold text-black/70 text-[10px] md:text-[16px]">{t('history.labels.weather')}</span>
                <CustomDropdown
                  value={Input.weather}
                  onChange={(val) => setInput({...Input, weather: val})}
                  options={[`${t('history.options.all')}`, `${t('history.options.sunny')}`, `${t('history.options.cloudy')}`, `${t('history.options.night')}`, `${t('history.options.windy')}`, `${t('history.options.stormy')}`, `${t('history.options.rainy')}`] || []}
                  placeholder="Select weather"
                />
             
          <span className="font-newblack font-bold text-black/70 text-[10px] md:text-[16px]">{t('history.labels.weather')}</span>
          <CustomDropdown value={Input.weather} onChange={(val) => setInput({ ...Input, weather: val })} options={[t('history.options.all'), t('history.options.sunny'), t('history.options.cloudy'), t('history.options.night'), t('history.options.windy'), t('history.options.stormy'), t('history.options.rainy')]} placeholder="Select weather" />
        </div>
        <div className='flex flex-col flex-1 md:min-w-[150px] min-w-[80px] bg-[#192514] text-[#E8FFE0] text-[10px] md:text-[16px] items-center justify-center self-end h-fit md:py-[5px] py-[6px] rounded-lg cursor-pointer'
          onClick={() => setInput({ date: '', time: '', crop: '', growthStage: t('history.growth_stages.all'), weather: t('history.options.all') })}>
          {t('history.buttons.reset')}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 flex flex-col min-h-0 w-full rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-5 bg-[#192514] border-b-2 border-[#57BD36] sticky top-0 z-10">
          {[t('history.labels.date'), t('history.labels.time'), t('history.labels.crop'), t('history.labels.growth_stage'), t('history.labels.weather')].map((header) => (
            <div key={header} className="text-[#E8FFE0] font-bold py-4 text-center text-[10px] md:text-[16px] uppercase tracking-wider">{header}</div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 bg-white custom-scrollbar">
          {loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <p className="text-[#192514] font-bold text-[14px] md:text-[18px] opacity-50">Loading history...</p>
            </div>
          )}

          {!loading && FilteredHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <p className="text-[#192514] font-bold text-[14px] md:text-[18px] opacity-50">{t('history.empty_state.no_records')}</p>
              <p className="text-[#192514] text-[11px] md:text-[16px] opacity-40">{t('history.empty_state.adjust_filters')}</p>
              <button onClick={() => setInput({ date: '', time: '', crop: '', growthStage: t('history.growth_stages.all'), weather: t('history.options.all') })} className="mt-2 px-4 py-2 bg-[#192514] text-[#E8FFE0] text-[10px] md:text-[16px] rounded-lg cursor-pointer hover:bg-[#55BB33] transition-colors duration-200">
                {t('history.buttons.clear_filters')}
              </button>
            </div>
        }
        {FilteredHistoryData.map((item) => (
          <div 
            key={item.id} 
            className={`grid grid-cols-5 items-center border-b border-[#bdbdbd7c]
               transition-colors duration-200 hover:bg-[#B0FF92] hover:bg-opacity-40 
               cursor-pointer
            `}
            onClick={() => handleItemClick(item)}
          >
            {/* Date */}
            <div className="py-4 font-bold text-center text-[#00000094] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px] ">
              <div className='md:mb-1 mb-[2px]'>
                <CalendarIcon size={isMobile ? 10 : undefined}/>
              </div> 
              {item.date}
            </div>

            {/* Time */}
            <div className="py-4 font-bold text-center text-[#1A3D00BA] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px]">
              <div className='md:mb-1 mb-[2px]'>
                <ClockIcon size={isMobile ? 10 : undefined}/>
              </div> 
              {item.time}
            </div>

            {/* Crop */}
            <div className="py-4 text-center font-bold text-[#192514] relative text-[10px] md:text-[16px]">
              <DynamicTranslator
                text={item.crop}
                language={i18n.language}
              />
            </div>

            {/* Growth Stage */}
            <div className="py-4 text-center text-[#2E6900] font-semibold capitalize text-[10px] md:text-[16px]">
              {/* {item.growthStage} */}
              {t(`history.growth_stages.${formatWithUnderscores(item.growthStage.toLowerCase())}`)}
            </div>
          )}

          {FilteredHistory.map((item) => {
            const WeatherIcon = weatherIconMap[item.weather] || SunnyIcon
            return (
              <div key={item.id} className="grid grid-cols-5 items-center border-b border-[#bdbdbd7c] transition-colors duration-200 hover:bg-[#B0FF92] hover:bg-opacity-40 cursor-pointer" onClick={() => handleItemClick(item)}>
                <div className="py-4 font-bold text-center text-[#00000094] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px]">
                  <div className='md:mb-1 mb-[2px]'><CalendarIcon size={isMobile ? 10 : undefined} /></div>
                  {item.date}
                </div>
                <div className="py-4 font-bold text-center text-[#1A3D00BA] flex items-center justify-center md:gap-2 gap-1 text-[10px] md:text-[16px]">
                  <div className='md:mb-1 mb-[2px]'><ClockIcon size={isMobile ? 10 : undefined} /></div>
                  {item.time}
                </div>
                <div className="py-4 text-center font-bold text-[#192514] text-[10px] md:text-[16px]">{item.crop}</div>
                <div className="py-4 text-center text-[#2E6900] font-semibold capitalize text-[10px] md:text-[16px]">{item.growthStage}</div>
                <div className="py-4 mx-auto"><WeatherIcon color={"#192514"} size={isMobile ? 15 : undefined} /></div>
              </div>
            )
          })}

          {hasMore && !loading && (
            <div className="py-4 text-center text-[#1A3D00] font-bold bg-white text-sm cursor-pointer hover:text-[#55BB33]" onClick={loadMore}>
              {t('history.loading')}
            </div>
          )}
          {loading && history.length > 0 && (
            <div className="py-4 text-center text-[#1A3D00] font-bold bg-white text-sm">Loading...</div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading && (
              <div className="bg-white rounded-3xl p-8 text-center">
                <p className="text-[#192514] font-semibold">Loading details...</p>
              </div>
            )}
            {detailError && (
              <div className="bg-white rounded-3xl p-8 text-center">
                <p className="text-red-500 font-semibold">{detailError}</p>
              </div>
            )}
            {detail && !detailLoading && (
              <HistoryDetailCard
                data={detail}
                onClose={closeModal}
                isMobile={isMobile}
                temperatureUnit={temperatureUnit}
                humidityUnit={humidityUnit}
                soilMoistureUnit={soilMoistureUnit}
                lightIntensityUnit={lightIntensityUnit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}