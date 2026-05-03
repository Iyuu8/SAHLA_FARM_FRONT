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
import useLiveState,{ID_TO_ACTUATOR_TYPE,ACTUATOR_TYPE_TO_ID} from '../hooks/useLiveState';
import { useSocket } from '../context/SocketContext';


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
    crop, setCrop, cropOptions, addCropOption,
    growthStage, setGrowthStage,
    mode, setMode,
    temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit,
  } = useFarmPreferences();

  const [actuators, setActuators] = useActuatorsState();

  // ── Live socket state ────────────────────────────────────────────────────
  const { socket } = useSocket();
  const {
  liveSensors,
  liveActuators,
  liveCrop,
  liveRecommendation,
  liveWarnings
} = useLiveState(DASHBOARD_SENSOR_OPTIONS);

  console.log('🔍 liveWarnings from backend:', liveWarnings);
  // Merge live actuators into local state when backend pushes an update
  useEffect(() => {
  if (!liveActuators) return;
  setActuators((prev) =>
    prev.map((actuator) => {
      // match backend type → frontend id
      const live = liveActuators.find(
        (a) => ACTUATOR_TYPE_TO_ID[a.type] === actuator.id
      );
      if (!live) return actuator;
      return {
        ...actuator,
        status: live.status          ?? actuator.status,
        mode:   live.control_mode === 'semi_auto' ? 'semi-auto' : 'auto',
        raw: {
          ...actuator.raw,
          run_at:           live.run_at,
          run_until:        live.run_until,
          duration_minutes: live.duration_minutes,
        },
      };
    })
  );
}, [liveActuators]);

  // Merge live crop into farm preferences when backend pushes an update
  useEffect(() => {
    if (!liveCrop) return;
    if (liveCrop.type)         setCrop(liveCrop.type);
    if (liveCrop.growth_stage) setGrowthStage(liveCrop.growth_stage);
    if (liveCrop.mode)         setMode(liveCrop.mode);
  }, [liveCrop]);

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

  const displayUnits = useMemo(
    () => ({
      temperatureUnit:  temperatureUnit  ?? NORMALIZED_USER.displayUnits.temp,
      humidityUnit:     humidityUnit     ?? NORMALIZED_USER.displayUnits.hum,
      soilMoistureUnit: soilMoistureUnit ?? NORMALIZED_USER.displayUnits.soil,
      lightIntensityUnit: lightIntensityUnit ?? NORMALIZED_USER.displayUnits.light,
    }),
    [temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit]
  );

  // Use live sensor value if available, otherwise fall back to dummy
  const baseTemperature = Number(
    (liveSensors ?? DASHBOARD_SENSOR_OPTIONS).find((s) => s.id === 'temperature')?.currentValue ?? 25
  );

  // Prefer live sensors over dummy data; apply unit conversion either way
  const convertedSensors = useMemo(
    () => (liveSensors ?? DASHBOARD_SENSOR_OPTIONS).map((sensor) => {
      const converted = convertSensorValueById(sensor.id, sensor.currentValue, displayUnits, baseTemperature);
      return {
        ...sensor,
        unit: converted.unit,
        currentValue: Number.isFinite(converted.value)
          ? formatConvertedValue(converted.value, '', 1)
          : sensor.currentValue,
      };
    }),
    [liveSensors, displayUnits, baseTemperature]
  );

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
      const nextStatus = actuator.status === 'on' ? 'off' : 'on';
      socket?.emit('set_entity', {
        type: 'actuator_status',
        payload: {
          actuatorType: ID_TO_ACTUATOR_TYPE[actuatorId] ?? actuatorId,
          value: nextStatus,
        },
      });
      return { ...actuator, status: nextStatus };
    })
  );
};

  const handleToggleGlobalMode = (nextSemiAutoState) => {
  setActuators((prev) =>
    prev.map((actuator) => {
      const nextMode = nextSemiAutoState ? 'semi-auto' : 'auto';
      socket?.emit('set_entity', {
        type: 'actuator_control_mode',
        payload: {
          actuatorType: ID_TO_ACTUATOR_TYPE[actuator.id] ?? actuator.id,
          value: nextSemiAutoState ? 'semi_auto' : 'auto',
        },
      });
      return { ...actuator, mode: nextMode };
    })
  );
};

  const handleToggleActuatorMode = (actuatorId) => {
  setActuators((prev) =>
    prev.map((actuator) => {
      if (actuator.id !== actuatorId) return actuator;
      const nextMode = actuator.mode === 'semi-auto' ? 'auto' : 'semi-auto';
      socket?.emit('set_entity', {
        type: 'actuator_control_mode',
        payload: {
          actuatorType: ID_TO_ACTUATOR_TYPE[actuatorId] ?? actuatorId,
          value: nextMode === 'semi-auto' ? 'semi_auto' : 'auto',
        },
      });
      return { ...actuator, mode: nextMode };
    })
  );
};

  // ── Sections ─────────────────────────────────────────────────────────────

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
      <MonitoringAlerts warnings={liveWarnings} />
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
        crop={crop}
        setCrop={setCrop}
        cropOptions={cropOptions}
        onAddCropOption={addCropOption}
        growthStage={growthStage}
        setGrowthStage={setGrowthStage}
        mode={mode}
        setMode={setMode}
        actuators={actuators}
        recommendation={liveRecommendation}
        socket={socket}
        liveCropOptions={liveCrop?.options ?? []}
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
      {/* Live indicator */}
      {socket?.connected && (
        <div className="flex items-center gap-1.5 self-end px-1">
          <span className="w-2 h-2 rounded-full bg-[#55BB33] animate-pulse" />
          <span className="text-xs text-[#55BB33] font-medium font-newblack">Live</span>
        </div>
      )}

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