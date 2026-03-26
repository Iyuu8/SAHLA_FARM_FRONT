import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronDown, Thermometer } from 'lucide-react';
import { CHART_RANGE_OPTIONS, CHART_Y_TICKS } from '../../data/dashboardData';

function RangeSelector({ activeRange, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = CHART_RANGE_OPTIONS.find((option) => option.key === activeRange) || CHART_RANGE_OPTIONS[2];

  return (
    <div className='relative'>
      <motion.button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='inline-flex items-center gap-1 border-b-2 border-[#192514] pb-0.5 text-[#192514] text-lg sm:text-xl md:text-[2rem] leading-none capitalize'
        whileTap={{ scale: 0.98 }}
      >
        {selected.label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
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
                {option.label}
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
  className = '',
}) {
  const [activeRange, setActiveRange] = useState('week');
  const [pinnedPoint, setPinnedPoint] = useState(null);

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
      className={`w-full h-full min-h-[280px] rounded-2xl bg-[#F8FFF6] p-3 sm:p-4 md:p-6 font-newblack ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className='flex items-start justify-between gap-2 sm:gap-3'>
        <h3 className='inline-flex items-center gap-2 text-lg sm:text-xl md:text-[2.1rem] text-[#192514] leading-none'>
          <Thermometer size={30} strokeWidth={1.8} />
          <span className='capitalize'>
            {selectedSensor?.label || 'Temperature'} {selectedSensor?.unit || '°C'}
          </span>
        </h3>

        <RangeSelector activeRange={activeRange} onChange={setActiveRange} />
      </div>

      <div className='mt-4 h-[220px] sm:h-[260px] md:h-[320px] relative'>
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
            margin={{ top: 8, right: 14, left: -4, bottom: 0 }}
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
              padding={{ left: 16, right: 20 }}
              tick={{ fill: 'rgba(25,37,20,0.7)', fontSize: 14 }}
              dy={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(25,37,20,0.45)', fontSize: 12 }}
              width={34}
              domain={yDomain}
              ticks={CHART_Y_TICKS}
            />
            <Tooltip
              cursor={false}
              formatter={(value) => [`${value}${selectedSensor?.unit || ''}`, 'Value']}
              labelFormatter={(label) => `${label}`}
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
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#192514', stroke: 'none' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
