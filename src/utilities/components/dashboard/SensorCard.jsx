import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicTranslator from '../Translation/DynamicTranslator';

const ICON_MAP = {
  temperature: Thermometer,
  humidity: Wind,
  soilMoisture: Droplets,
  lightIntensity: Sun,
};

export default function SensorCard({ sensor, isSelected, onClick }) {
  const { t , i18n} = useTranslation();
  const Icon = ICON_MAP[sensor.id] || Thermometer;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      initial={false}
      animate={{
        backgroundColor: isSelected ? '#55BB33' : '#FFFFFF',
      }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      // CHANGED: text-left to text-start for proper RTL alignment
      className="relative overflow-hidden rounded-[25px] p-3 sm:p-4 flex flex-col justify-between gap-3 text-start w-full h-full cursor-pointer focus:outline-none shadow-[4px_4px_10px_0px_rgba(0,0,0,0.06)] font-newblack"
    >
      {/* Top gradient overlay for selected state */}
      <motion.div
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(321deg, rgba(150,209,64,0.30) 0%, rgba(93,198,55,0.30) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP SECTION: Icon + Label */}
      {/* The magic happens here: 'flex-col' by default (for smaller screens), shifts to 'xl:flex-row' on large monitors */}
      <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center gap-2 xl:gap-3 w-full">
        <motion.div
          animate={{
            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#D6F7CB',
          }}
          className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
        >
          <motion.div animate={{ color: isSelected ? '#F7FFF6' : '#62BC45' }}>
            <Icon size={20} strokeWidth={2.2} color="currentColor" />
          </motion.div>
        </motion.div>

        <motion.span
          animate={{ color: isSelected ? '#F7FFF6' : '#192514' }}
          className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold leading-tight"
        >
          {/* Dynamically translates the label, falling back to the prop string */}
          {t(`dashboard.sensors.${sensor.id}.label`, sensor.label)}
        </motion.span>
      </div>

      {/* BOTTOM SECTION: Value + Unit + Description */}
      <div className="relative z-10 flex flex-col mt-auto w-full">
        {/* 'flex-wrap' ensures the unit safely drops down if the number gets too wide */}
        <div className="flex items-baseline gap-1 xl:gap-1.5 flex-wrap xl:flex-nowrap">
          <motion.span
            animate={{ color: isSelected ? '#F7FFF6' : '#192514' }}
            // Scaled text: Slightly smaller on medium laptops to prevent overflow, scales up on XL
            className="text-[34px] lg:text-[36px] xl:text-[44px] tracking-tight font-bold leading-none"
          >
            {sensor.currentValue}
          </motion.span>
          <motion.span
            animate={{ color: isSelected ? '#F7FFF6' : '#192514' }}
            className="text-sm lg:text-md xl:text-lg font-semibold shrink-0"
          >
            {/* Kept static as units usually don't change across languages, but you can wrap this in t() if needed */}
            {sensor.unit}
          </motion.span>
        </div>

        {/* Description */}
        <motion.p
          animate={{ color: isSelected ? 'rgba(247, 255, 246, 0.85)' : '#879284' }}
          className="text-[11px] sm:text-[12px] mt-1 sm:mt-1.5 leading-snug line-clamp-2"
        >
          <DynamicTranslator text={sensor.description} language={i18n.language} />
          {/* Dynamically translates the description, falling back to the prop string */}
          
        </motion.p>
      </div>
    </motion.button>
  );
}