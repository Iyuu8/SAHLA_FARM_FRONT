import { useMemo, useState, useEffect } from 'react'; //tools from react
import { motion } from 'framer-motion'; //for animations
import ChartCard from '../utilities/components/dashboard/ChartCard'; //the chart card (for the sensor history)
import ActuatorCarousel from '../utilities/components/dashboard/ActuatorCarousel'; //actuator card
import ManualModeCard from '../utilities/components/dashboard/ManualModeCard'; //manual mode card
import EditActuatorsModal from '../utilities/components/dashboard/EditActuatorsModal'; //manual mode pop up
import SensorCard from '../utilities/components/dashboard/SensorCard'; //sensor card
import CropInfoCard from '../utilities/components/dashboard/CropInfoCard'; //crop info card
import {
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
import usePersistentState from '../hooks/usePersistentState';


import { buildRangeSeries } from '../utilities/data/dashboardData.js';
import { formatSensorUnit } from '../utilities/data/dashboardData.js';

import { useSocket } from '../context/SocketContext.jsx';

import Spinner from '../utilities/components/loading/Spinner.jsx';


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
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();


  const { crop, recommendation, warnings, sensors, graphData, actuators, socket } = useSocket();



  const setCrop = (next) => {
    socket.emit('change_state', { target: "crop", newState: { ...crop, type: next } });
  };
  const setGrowthStage = (next) => {

    socket.emit('change_state', { target: "crop", newState: { ...crop, growth_stage: next } });
  };
  const setMode = (next) => {
    const capitalizedNext = next.charAt(0).toUpperCase() + next.slice(1).toLowerCase();
    socket.emit('change_state', { target: "crop", newState: { ...crop, mode: capitalizedNext } });
  };


  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Normalization maps backend sensor "type" values to UI-safe IDs used across components.
const SENSOR_TYPE_TO_ID = {
  temperature: 'temperature',
  air_humidity: 'humidity',
  soil_moisture: 'soilMoisture',
  light_intensity: 'lightIntensity',
};

// Human-friendly labels rendered in cards, chart headers, and AI context lines.
const SENSOR_TYPE_TO_LABEL = {
  temperature: 'Temperature',
  air_humidity: 'Humidity',
  soil_moisture: 'Soil Moisture',
  light_intensity: 'Light Intensity',
};

// Fallback units keep UI stable when backend unit is missing.
const SENSOR_DEFAULT_UNIT = {
  temperature: '°C',
  air_humidity: '%',
  soil_moisture: '%',
  light_intensity: 'lux',
};

  const DASHBOARD_SENSOR_OPTIONS = (sensors || []).map((sensor, index) => {
    const sensorType = sensor.type;
    const sensorId = SENSOR_TYPE_TO_ID[sensorType] || `sensor-${index}`;
  
    return {
      id: sensorId,
      label: SENSOR_TYPE_TO_LABEL[sensorType] || sensorType,
      unit: formatSensorUnit(sensor.unit, sensorType),
      currentValue: sensor.value,
      description: sensor.description || 'No sensor description available.',
      raw: sensor,
    };
  });

  const normalizedSensorSeriesByType = !graphData ? null : Object.fromEntries(
  graphData.map((entry) => [entry.sensor.type, buildRangeSeries(entry.data || [])])
);

// Converts series keyed by backend type into series keyed by normalized UI sensor id.
const DASHBOARD_SENSOR_SERIES =  !graphData ? null : Object.fromEntries(
  DASHBOARD_SENSOR_OPTIONS.map((sensorOption) => {
    const sourceType = Object.keys(SENSOR_TYPE_TO_ID).find((key) => SENSOR_TYPE_TO_ID[key] === sensorOption.id);
    return [sensorOption.id, normalizedSensorSeriesByType[sourceType] || { today: [], threeDays: [], week: [] }];
  })
);



  useEffect(() => {
    const exists = DASHBOARD_SENSOR_OPTIONS.some((sensor) => sensor.id === selectedSensorId);
    if (!exists) setSelectedSensorId(DEFAULT_SELECTED_SENSOR_ID);
  }, [selectedSensorId, setSelectedSensorId]);

  // Display units are composed here so both cards and chart use the same conversion source.
  // NORMALIZED_USER provides compatibility keys (temp/hum/soil/light) from new profile schema.
  const displayUnits = useMemo(
    () => ( !sensors.length ? [] : {
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
    () => !sensors ? null : DASHBOARD_SENSOR_OPTIONS.map((sensor) => {
      const converted = convertSensorValueById(sensor.id, sensor.currentValue, displayUnits, baseTemperature);

      return {
        ...sensor,
        unit: converted.unit,
        currentValue: Number.isFinite(converted.value)
          ? formatConvertedValue(converted.value, '', 1)
          : sensor.currentValue,
      };
    }),
    [displayUnits, baseTemperature, sensors]
  );

  // Converts normalized chart series per selected display units.
  // Note: today uses raw intraday points from data layer; wider ranges are pre-averaged there.
  const convertedSeriesBySensor = useMemo(
    () => !graphData ? [] : Object.fromEntries(
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
    [displayUnits, baseTemperature, sensors]
  );

  const selectedSensor = useMemo(
    () => !sensors ? null : convertedSensors.find((s) => s.id === selectedSensorId) || convertedSensors[0],
    [selectedSensorId, convertedSensors]
  );

  const globalMode = useMemo(() => {
    const allAuto = actuators.every((a) => a.control_mode === 'auto');
    return allAuto ? 'auto' : 'semi_auto';
  }, [actuators]);

  const handleToggleActuatorStatus = (actuatorId) => {
    const newActuatorsState = actuators.map((actuator) => {
        if (actuator.id !== actuatorId) return actuator;
        if (actuator.control_mode !== 'semi_auto') return actuator;
        return { ...actuator, status: actuator.status === 'on' ? 'off' : 'on' };
      })
    socket.emit('change_state', {target: 'actuators', newState : newActuatorsState});
  };

  const handleToggleGlobalMode = (nextSemiAutoState) => {
    const newActuatorsState = actuators.map((actuator) => ({
        ...actuator,
        control_mode: nextSemiAutoState ? 'semi_auto' : 'auto',
      }))
    socket.emit('change_state', {target: 'actuators', newState : newActuatorsState});
  };

  const handleToggleActuatorMode = (actuatorId) => {
    const newActuatorsState = actuators.map((actuator) =>
        actuator.id === actuatorId
          ? { ...actuator, control_mode: actuator.control_mode === 'semi_auto' ? 'auto' : 'semi_auto' }
          : actuator
      )
    socket.emit('change_state', {target: 'actuators', newState : newActuatorsState});  
  };

  const chartSection = sensors.length > 0 && (
    <motion.div
      key="chart"
      className="w-full shrink-0 h-[380px] lg:h-full lg:min-h-[280px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.32, ease: 'easeOut' }}
    >
      {selectedSensor ? <ChartCard
        selectedSensor={selectedSensor}
        seriesByRange={convertedSeriesBySensor[selectedSensor.id]}
        activeRange={activeRange}
        onChangeRange={setActiveRange}
        className="h-full"
      /> : <div className="w-full h-full flex items-center justify-center"><Spinner size={50} /></div>}
    </motion.div>
  );

  const alertsSection = sensors.length > 0 && (
    <motion.div
      key="alerts"
      className="w-full shrink-0 min-h-[350px] lg:min-h-0 lg:h-full"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.3, ease: 'easeOut' }}
    >
      <MonitoringAlerts warnings={warnings} />
    </motion.div>
  );

  const actuatorsSection = sensors.length > 0 && (
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

  const sensorsSection = sensors.length > 0 &&(
    <motion.div
      key="sensors"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.32, ease: 'easeOut' }}
    >
      {convertedSensors.map((sensor) => (
        <SensorCard
          key={sensor.type}
          sensor={sensor}
          isSelected={sensor.id === selectedSensorId}
          onClick={() => setSelectedSensorId(sensor.id)}
        />
      ))}
    </motion.div>
  );

  const cropInfoSection = sensors.length > 0 &&(
    <motion.div
      key="crop-info"
      className="w-full shrink-0 min-h-[200px] lg:h-full"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.22, duration: 0.3, ease: 'easeOut' }}
    >
      <CropInfoCard
        crop={crop.type ?? NORMALIZED_USER.farmSettings.crop}
        setCrop={setCrop}
        cropOptions={profileSettingOptions.cropOptions}
        growthStage={crop.growth_stage ?? NORMALIZED_USER.farmSettings.growth}
        setGrowthStage={setGrowthStage}
        mode={crop?.mode}
        setMode={setMode}
        actuators={actuators}
        recommendation={recommendation}
      />
    </motion.div>
  );

  return !sensors.length ? (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size={60} />
      </div>
    ) : (
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
  )
  ;
}