import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronDown, Thermometer } from 'lucide-react';
import { CHART_RANGE_OPTIONS } from '../../data/dashboardData';
import { useTranslation } from 'react-i18next';


function RangeSelector({ activeRange, onChange, isCompact }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = CHART_RANGE_OPTIONS.find((option) => option.key === activeRange) || CHART_RANGE_OPTIONS[2];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);
 console.log(selected)
  return (
    <div className='relative shrink-0' ref={containerRef}>
      <motion.button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center border-b-2 border-[#192514] pb-0.5 text-[#192514] leading-none capitalize whitespace-nowrap ${
          isCompact
            ? 'gap-0.5 text-[1.05rem]'
            : 'gap-1 text-[1.2rem] sm:text-xl md:text-[2rem]'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {t(`dashboard.chart.ranges.${selected.key}`)}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={isCompact ? 16 : 20} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className='absolute right-0 mt-2 min-w-[160px] rounded-lg border border-[rgba(25,37,20,0.15)] bg-[#F8FFF6] shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden z-20'
          >
            {CHART_RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type='button'
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm capitalize transition-colors ${
                  option.key === activeRange
                    ? 'bg-[#D6F7CB] text-[#192514]'
                    : 'text-[#192514] hover:bg-[#EEF5EB]'
                }`}
              >
                {t(`dashboard.chart.ranges.${option.key}`)}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ChartCard({
  selectedSensor,
  seriesByRange,
  activeRange,
  onChangeRange,
  className = '',
}) {
  const { t } = useTranslation();
  const [pinnedPoint, setPinnedPoint] = useState(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 420);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    const series = seriesByRange?.[activeRange] || [];
    return series.map((point) => ({
      label: point.label,
      value: point.value,
    }));
  }, [seriesByRange, activeRange]);

  const yDomain = useMemo(() => {
    if (!chartData.length) return [0, 100];
    const values = chartData.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max(2, Math.round((max - min) * 0.15));
    return [Math.max(0, min - pad), max + pad];
  }, [chartData]);

  const yTicks = useMemo(() => {
    const [min, max] = yDomain;
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
      return [min, max];
    }

    const step = (max - min) / 3;
    return [
      min,
      min + step,
      min + step * 2,
      max,
    ].map((tick) => Number(tick.toFixed(1)));
  }, [yDomain]);

  const yAxisWidth = useMemo(() => {
    const longestLabelLength = Math.max(
      ...yTicks.map((tick) => String(Math.round(tick)).length),
      2
    );
    const base = isCompact ? 34 : 42;
    return base + Math.max(0, longestLabelLength - 2) * 5;
  }, [yTicks, isCompact]);

  useEffect(() => {
    setPinnedPoint(null);
  }, [activeRange, seriesByRange]);

  const handleChartClick = (state) => {
    const point = state?.activePayload?.[0];
    if (!point) return;

    setPinnedPoint({
      label: state?.activeLabel ?? point.payload?.label,
      value: point.value,
    });
  };

  return (
    <motion.div
      className={`flex flex-col w-full h-full min-h-[280px] rounded-2xl bg-[#F8FFF6] p-3 sm:p-4 md:p-6 font-newblack ${className || ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className='flex items-start justify-between gap-2 sm:gap-3 min-w-0'>
        <h3 className='inline-flex min-w-0 max-w-[68%] sm:max-w-none items-center gap-1 sm:gap-2 text-[1.05rem] sm:text-xl md:text-[2.1rem] text-[#192514] leading-tight'>
          <Thermometer size={isCompact ? 24 : 30} strokeWidth={1.8} />
          <span className='capitalize block'>
            {selectedSensor 
    ? t(`dashboard.sensors.${selectedSensor.id}.label`) 
    : t('dashboard.chart.fallbackSensor')} {selectedSensor?.unit || ''}
          </span>
        </h3>

        <RangeSelector activeRange={activeRange} onChange={onChangeRange} isCompact={isCompact} />
      </div>

      <div className='flex-1 min-h-0 w-full relative mt-3 sm:mt-4'>
        <AnimatePresence>
          {pinnedPoint ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className='absolute top-2 left-1/2 -translate-x-1/2 z-10 rounded-md bg-[rgba(25,37,20,0.9)] px-3 py-1 text-xs text-[#F8FFF6]'
            >
              {pinnedPoint.label}: {pinnedPoint.value}{selectedSensor?.unit || ''}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: isCompact ? 6 : 14, left: isCompact ? 6 : 10, bottom: 0 }}
            onClick={handleChartClick}
          >
            <defs>
              <linearGradient id='chartLineGradient' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='#000000' stopOpacity={0.4} />
                <stop offset='100%' stopColor='#000000' stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='label'
              tickLine={false}
              axisLine={false}
              interval={0}
              padding={{ left: isCompact ? 8 : 16, right: isCompact ? 10 : 20 }}
              tickFormatter={(label) => t(`history.day.${label.toLowerCase()}`)}
              tick={{ fill: 'rgba(25,37,20,0.7)', fontSize: isCompact ? 12 : 14 }}
              dy={isCompact ? 10 : 12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(25,37,20,0.45)', fontSize: isCompact ? 10 : 12 }}
              tickFormatter={(value) => `${Math.round(value)}`}
              width={yAxisWidth}
              domain={yDomain}
              ticks={yTicks}
            />
            <Tooltip
              cursor={false}
              formatter={(value) => [`${value}${selectedSensor?.unit || ''}`, t('dashboard.chart.tooltipValue')]}
              labelFormatter={(label) => t(`history.day.${label.toLowerCase()}`)}
              contentStyle={{
                border: '1px solid rgba(25,37,20,0.15)',
                borderRadius: '8px',
                backgroundColor: '#F8FFF6',
                color: '#192514',
                fontFamily: 'NewBlack',
                fontSize: '12px',
                padding: '6px 8px',
              }}
            />
            <Line
              type='monotone'
              dataKey='value'
              stroke='url(#chartLineGradient)'
              strokeWidth={isCompact ? 2.5 : 3}
              dot={false}
              activeDot={{ r: isCompact ? 4 : 5, fill: '#192514', stroke: 'none' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
