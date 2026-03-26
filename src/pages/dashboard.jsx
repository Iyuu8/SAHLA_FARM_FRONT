import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../utilities/components/dashboard/ChartCard';
import ActuatorCarousel from '../utilities/components/dashboard/ActuatorCarousel';
import ManualModeCard from '../utilities/components/dashboard/ManualModeCard';
import EditActuatorsModal from '../utilities/components/dashboard/EditActuatorsModal';
import {
  DEFAULT_SELECTED_SENSOR_ID,
  INITIAL_ACTUATORS,
  SENSOR_OPTIONS,
  SENSOR_SERIES,
} from '../utilities/data/dashboardData';

export default function Dashboard() {
  const [actuators, setActuators] = useState(INITIAL_ACTUATORS);
  const [isEditActuatorsOpen, setIsEditActuatorsOpen] = useState(false);

  const selectedSensor = useMemo(
    () => SENSOR_OPTIONS.find((sensor) => sensor.id === DEFAULT_SELECTED_SENSOR_ID) || SENSOR_OPTIONS[0],
    []
  );

  const globalMode = useMemo(() => {
    const allAuto = actuators.every((actuator) => actuator.mode === 'auto');
    return allAuto ? 'auto' : 'semi-auto';
  }, [actuators]);

  const handleToggleActuatorStatus = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) => {
        if (actuator.id !== actuatorId) return actuator;
        if (actuator.mode !== 'semi-auto') return actuator;

        return {
          ...actuator,
          status: actuator.status === 'on' ? 'off' : 'on',
        };
      })
    );
  };

  const handleToggleGlobalMode = (nextSemiAutoState) => {
    setActuators((prev) =>
      prev.map((actuator) => ({
        ...actuator,
        mode: nextSemiAutoState ? 'semi-auto' : 'auto',
      }))
    );
  };

  const handleToggleActuatorMode = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) =>
        actuator.id === actuatorId
          ? { ...actuator, mode: actuator.mode === 'semi-auto' ? 'auto' : 'semi-auto' }
          : actuator
      )
    );
  };

  return (
    <motion.div
      className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 p-3 overflow-y-auto overflow-x-hidden lg:overflow-hidden font-newblack"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >

      {/* ══ LEFT COLUMN ══ */}
      <div className="flex flex-col gap-3 min-h-0 min-w-0">

        {/* CHART CARD */}
        <motion.div
          className="bg-[#F8FFF6] rounded-2xl p-1 sm:p-1 flex-1 min-h-[280px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.32, ease: 'easeOut' }}
        >
          <ChartCard
            selectedSensor={selectedSensor}
            seriesByRange={SENSOR_SERIES[selectedSensor.id]}
          />
        </motion.div>

        {/* ACTUATORS ROW */}
        <motion.div
          className="grid grid-cols-[minmax(0,1fr)_158px] sm:grid-cols-[minmax(0,1fr)_170px] md:flex md:flex-row md:items-stretch gap-3 min-w-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.32, ease: 'easeOut' }}
        >

          {/* actuator carousel */}
          <div className="flex-1 min-w-0">
            <ActuatorCarousel
              actuators={actuators}
              onToggleActuatorStatus={handleToggleActuatorStatus}
            />
          </div>

          {/* manual mode — always visible, never in carousel */}
          <div className="shrink-0 md:ml-auto">
            <ManualModeCard
              globalMode={globalMode}
              onToggleGlobalMode={handleToggleGlobalMode}
              onOpenEdit={() => setIsEditActuatorsOpen(true)}
            />
          </div>

        </motion.div>

        {/* SENSOR CARDS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* <SensorCard /> */}
          {/* <SensorCard /> */}
          {/* <SensorCard /> */}
          {/* <SensorCard /> */}
        </div>

      </div>

      {/* ══ RIGHT COLUMN ══ */}
      <motion.div
        className="flex flex-col gap-3 min-h-0"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.3, ease: 'easeOut' }}
      >

        {/* MONITORING ALERTS */}
        <div className="bg-[#1e2a18] rounded-2xl p-4 flex-1">
          {/* <MonitoringAlerts /> */}
        </div>

        {/* CROP INFO + RECOMMENDATIONS */}
        <div className="bg-[#2d4a1e] rounded-2xl p-4">
          {/* <CropInfo /> */}
        </div>

      </motion.div>

      <EditActuatorsModal
        isOpen={isEditActuatorsOpen}
        onClose={() => setIsEditActuatorsOpen(false)}
        actuators={actuators}
        onToggleActuatorMode={handleToggleActuatorMode}
      />

    </motion.div>
  )
}