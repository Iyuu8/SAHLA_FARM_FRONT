import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChartCard from '../utilities/components/dashboard/ChartCard';
import ActuatorCarousel from '../utilities/components/dashboard/ActuatorCarousel';
import ManualModeCard from '../utilities/components/dashboard/ManualModeCard';
import EditActuatorsModal from '../utilities/components/dashboard/EditActuatorsModal';
import SensorCard from '../utilities/components/dashboard/SensorCard';
import CropInfoCard from '../utilities/components/dashboard/CropInfoCard';
import {
  DASHBOARD_SENSOR_OPTIONS,
  DASHBOARD_SENSOR_SERIES,
  DEFAULT_SELECTED_SENSOR_ID,
} from '../utilities/data/dashboardData';
import { useTranslation } from 'react-i18next';
import { NORMALIZED_USER, profileSettingOptions } from '../utilities/data/profileSettings';
import { STORAGE_KEYS } from '../utilities/data/storageKeys';
import MonitoringAlerts from '../utilities/components/dashboard/MonitoringAlerts';
import {
  convertSensorValueById,
  formatConvertedValue,
} from '../utilities/functions/conversionFunctions';
import useFarmPreferences from '../hooks/useFarmPreferences';
import useActuatorsState from '../hooks/useActuatorsState';
import usePersistentState from '../hooks/usePersistentState';

/**
 * Dashboard page composition.
 *
 * How data flows:
 * - User-editable farm preferences come from useFarmPreferences (shared with Settings/AIchat).
 * - Actuator state comes from useActuatorsState (shared with AIchat context and persisted).
 * - Sensor/time-series dummy data is imported from dashboardData and never persisted.
 * - Dashboard-only view state (selected sensor/range) is persisted to simulate user session continuity.
 */
export default function Dashboard() {
  
  const [isEditActuatorsOpen, setIsEditActuatorsOpen] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = usePersistentState(
    `${STORAGE_KEYS.dashboardView}:selectedSensorId`,
    DEFAULT_SELECTED_SENSOR_ID
  );
  const [activeRange, setActiveRange] = usePersistentState(
    `${STORAGE_KEYS.dashboardView}:activeRange`,
    'week'
  );
  const [isDesktop, setIsDesktop] = useState(true);

  const {
    crop,
    setCrop,
    cropOptions,
    addCropOption,
    growthStage,
    setGrowthStage,
    mode,
    setMode,
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  const [actuators, setActuators] = useActuatorsState();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const exists = DASHBOARD_SENSOR_OPTIONS.some((sensor) => sensor.id === selectedSensorId);
    if (!exists) setSelectedSensorId(DEFAULT_SELECTED_SENSOR_ID);
  }, [selectedSensorId, setSelectedSensorId]);

  // Display units are composed here so both cards and chart use the same conversion source.
  // NORMALIZED_USER provides compatibility keys (temp/hum/soil/light) from new profile schema.
  const displayUnits = useMemo(
    () => ({
      temperatureUnit: temperatureUnit ?? NORMALIZED_USER.displayUnits.temp,
      humidityUnit: humidityUnit ?? NORMALIZED_USER.displayUnits.hum,
      soilMoistureUnit: soilMoistureUnit ?? NORMALIZED_USER.displayUnits.soil,
      lightIntensityUnit: lightIntensityUnit ?? NORMALIZED_USER.displayUnits.light,
    }),
    [temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit]
  );

  const baseTemperature = Number(DASHBOARD_SENSOR_OPTIONS.find((s) => s.id === 'temperature')?.currentValue ?? 25);

  // Uses normalized sensor options from dashboardData and applies current display-unit conversion.
  const convertedSensors = useMemo(
    () => DASHBOARD_SENSOR_OPTIONS.map((sensor) => {
      const converted = convertSensorValueById(sensor.id, sensor.currentValue, displayUnits, baseTemperature);

      return {
        ...sensor,
        unit: converted.unit,
        currentValue: Number.isFinite(converted.value)
          ? formatConvertedValue(converted.value, '', 1)
          : sensor.currentValue,
      };
    }),
    [displayUnits, baseTemperature]
  );

  // Converts normalized chart series per selected display units.
  // Note: today uses raw intraday points from data layer; wider ranges are pre-averaged there.
  const convertedSeriesBySensor = useMemo(
    () => Object.fromEntries(
      Object.entries(DASHBOARD_SENSOR_SERIES).map(([sensorId, seriesByRange]) => {
        const convertedSeries = Object.fromEntries(
          Object.entries(seriesByRange).map(([rangeKey, points]) => [
            rangeKey,
            points.map((point) => {
              const converted = convertSensorValueById(sensorId, point.value, displayUnits, baseTemperature);
              return {
                ...point,
                value: Number.isFinite(converted.value) ? converted.value : point.value,
              };
            }),
          ])
        );

        return [sensorId, convertedSeries];
      })
    ),
    [displayUnits, baseTemperature]
  );

  const selectedSensor = useMemo(
    () => convertedSensors.find((s) => s.id === selectedSensorId) || convertedSensors[0],
    [selectedSensorId, convertedSensors]
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
        seriesByRange={convertedSeriesBySensor[selectedSensor.id]}
        activeRange={activeRange}
        onChangeRange={setActiveRange}
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
      {convertedSensors.map((sensor) => (
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
      className="w-full shrink-0 min-h-[200px] lg:h-full"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.22, duration: 0.3, ease: 'easeOut' }}
    >
      <CropInfoCard
        crop={crop ?? NORMALIZED_USER.farmSettings.crop}
        setCrop={setCrop}
        cropOptions={cropOptions ?? profileSettingOptions.cropOptions}
        onAddCropOption={addCropOption}
        growthStage={growthStage ?? NORMALIZED_USER.farmSettings.growth}
        setGrowthStage={setGrowthStage}
        mode={mode ?? NORMALIZED_USER.farmSettings.mode}
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