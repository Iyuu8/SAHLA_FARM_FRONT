import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../utilities/components/dashboard/ChartCard';
import ActuatorCarousel from '../utilities/components/dashboard/ActuatorCarousel';
import ManualModeCard from '../utilities/components/dashboard/ManualModeCard';
import EditActuatorsModal from '../utilities/components/dashboard/EditActuatorsModal';
import SensorCard from '../utilities/components/dashboard/SensorCard';
import CropInfoCard from '../utilities/components/dashboard/CropInfoCard';
import {
  DEFAULT_SELECTED_SENSOR_ID,
  INITIAL_ACTUATORS,
  SENSOR_OPTIONS,
  SENSOR_SERIES,
} from '../utilities/data/dashboardData';
import { user, profileSettingOptions } from '../utilities/data/profileSettings';
import MonitoringAlerts from '../utilities/components/dashboard/MonitoringAlerts';

export default function Dashboard({
  // Shared with Settings page via parent (App.js / layout)
  crop,
  setCrop,
  cropOptions,
  growthStage,
  setGrowthStage,
  mode,
  setMode,
}) {
  const [actuators, setActuators] = useState(INITIAL_ACTUATORS);
  const [isEditActuatorsOpen, setIsEditActuatorsOpen] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState(DEFAULT_SELECTED_SENSOR_ID);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedSensor = useMemo(
    () => SENSOR_OPTIONS.find((s) => s.id === selectedSensorId) || SENSOR_OPTIONS[0],
    [selectedSensorId]
  );

  const globalMode = useMemo(() => {
    const allAuto = actuators.every((a) => a.mode === 'auto');
    return allAuto ? 'auto' : 'semi-auto';
  }, [actuators]);

  const handleToggleActuatorStatus = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) => {
        if (actuator.id !== actuatorId) return actuator;
        if (actuator.mode !== 'semi-auto') return actuator;
        return { ...actuator, status: actuator.status === 'on' ? 'off' : 'on' };
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

  const chartSection = (
    <motion.div
      key="chart"
      className="w-full shrink-0 h-[380px] lg:h-full lg:min-h-[280px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.32, ease: 'easeOut' }}
    >
      <ChartCard
        selectedSensor={selectedSensor}
        seriesByRange={SENSOR_SERIES[selectedSensor.id]}
        className="h-full"
      />
    </motion.div>
  );

  const alertsSection = (
    <motion.div
      key="alerts"
      className="w-full shrink-0 min-h-[350px] lg:min-h-0 lg:h-full"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.3, ease: 'easeOut' }}
    >
      <MonitoringAlerts />
    </motion.div>
  );

  const actuatorsSection = (
    <motion.div
      key="actuators"
      className="grid grid-cols-[minmax(0,1fr)_158px] sm:grid-cols-[minmax(0,1fr)_170px] md:flex md:flex-row md:items-stretch gap-3 min-w-0 shrink-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.32, ease: 'easeOut' }}
    >
      <div className="flex-1 min-w-0">
        <ActuatorCarousel
          actuators={actuators}
          onToggleActuatorStatus={handleToggleActuatorStatus}
        />
      </div>
      <div className="shrink-0 md:ml-auto">
        <ManualModeCard
          globalMode={globalMode}
          onToggleGlobalMode={handleToggleGlobalMode}
          onOpenEdit={() => setIsEditActuatorsOpen(true)}
        />
      </div>
    </motion.div>
  );

  const sensorsSection = (
    <motion.div
      key="sensors"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.32, ease: 'easeOut' }}
    >
      {SENSOR_OPTIONS.map((sensor) => (
        <SensorCard
          key={sensor.id}
          sensor={sensor}
          isSelected={sensor.id === selectedSensorId}
          onClick={() => setSelectedSensorId(sensor.id)}
        />
      ))}
    </motion.div>
  );

  const cropInfoSection = (
    <motion.div
      key="crop-info"
      className="w-full shrink-0 min-h-[250px] lg:h-full"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.22, duration: 0.3, ease: 'easeOut' }}
    >
      <CropInfoCard
        crop={crop ?? user.farmSettings.crop}
        setCrop={setCrop}
        cropOptions={cropOptions ?? profileSettingOptions.cropOptions}
        growthStage={growthStage ?? user.farmSettings.growth}
        setGrowthStage={setGrowthStage}
        mode={mode ?? user.farmSettings.mode}
        setMode={setMode}
        actuators={actuators}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="w-full min-h-full flex flex-col gap-4 p-3 overflow-y-auto overflow-x-hidden font-newblack bg-[#F5F7F6]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {isDesktop ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 w-full">
            {chartSection}
            {alertsSection}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 w-full items-start">
            <div className="flex flex-col gap-3 min-w-0">
              {actuatorsSection}
              {sensorsSection}
            </div>
            {cropInfoSection}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5 w-full pb-4">
          {chartSection}
          {sensorsSection}
          {actuatorsSection}
          {cropInfoSection}
          {alertsSection}
        </div>
      )}

      <EditActuatorsModal
        isOpen={isEditActuatorsOpen}
        onClose={() => setIsEditActuatorsOpen(false)}
        actuators={actuators}
        onToggleActuatorMode={handleToggleActuatorMode}
      />
    </motion.div>
  );
}