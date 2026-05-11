import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const SENSOR_TYPE_TO_ID = {
  farm_temperature: "temperature",
  farm_humidity: "humidity",
  farm_soil_moisture: "soilMoisture",
  farm_ambient_light: "lightIntensity",
};

export const ACTUATOR_TYPE_TO_ID = {
  pump: "act-pmp-01",
  fan: "act-fan-01",
};

export const ID_TO_ACTUATOR_TYPE = {
  "act-pmp-01": "pump",
  "act-fan-01": "fan",
};
const EMPTY_ARRAY = [];

export default function useLiveState(initialSensorOptions = EMPTY_ARRAY) {
  const { socket, liveState } = useSocket();

  const [liveSensors, setLiveSensors] = useState(null);
  const [liveActuators, setLiveActuators] = useState(null);
  const [liveCrop, setLiveCrop] = useState(null);
  const [liveWarnings, setLiveWarnings] = useState(null);
  const [liveRecommendation, setLiveRecommendation] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveNotifications, setLiveNotifications] = useState(null);

  // Seed all state from the initial HA snapshot
  useEffect(() => {
    if (!liveState) return;

    if (liveState.recommendation) setLiveRecommendation(liveState.recommendation);
    if (liveState.crop) setLiveCrop(liveState.crop);
    if (liveState.actuators) setLiveActuators(liveState.actuators);
    if (liveState.warnings) setLiveWarnings(liveState.warnings);
    if (liveState.weather) setLiveWeather(liveState.weather);
    if (liveState.notifications) setLiveNotifications(liveState.notifications);

    if (Array.isArray(liveState.sensors)) {
      setLiveSensors((prev) => {
        // Safe fallback: guarantee we are mapping over an array
        const base = Array.isArray(prev) && prev.length > 0 
          ? prev 
          : (Array.isArray(initialSensorOptions) ? initialSensorOptions : []);
          
        return base.map((sensor) => {
          const backendSensor = liveState.sensors.find(
            (s) => SENSOR_TYPE_TO_ID[s.type] === sensor.id
          );
          if (!backendSensor) return sensor;
          return {
            ...sensor,
            currentValue: backendSensor.value ?? sensor.currentValue,
          };
        });
      });
    }
  }, [liveState]);

  // Live socket updates
  useEffect(() => {
    if (!socket) return;

    const onSensor = ({ value }) => {
      if (!Array.isArray(value)) return; // Safety check: Ignore bad socket payloads

      setLiveSensors((prev) => {
        // Safe fallback: guarantee we are mapping over an array
        const base = Array.isArray(prev) && prev.length > 0 
          ? prev 
          : (Array.isArray(initialSensorOptions) ? initialSensorOptions : []);

        return base.map((sensor) => {
          const backendSensor = value.find(
            (s) => SENSOR_TYPE_TO_ID[s.type] === sensor.id
          );
          if (!backendSensor) return sensor;
          return {
            ...sensor,
            currentValue: backendSensor.value ?? sensor.currentValue,
            description: backendSensor.description ?? sensor.description,
          };
        });
      });
    };

    const onActuator = ({ value }) => setLiveActuators(value);
    const onCrop = ({ value }) => setLiveCrop(value);
    const onWarning = ({ value }) => setLiveWarnings(value);
    const onRecommendation = ({ value }) => setLiveRecommendation(value);
    const onWeather = ({ value }) => setLiveWeather(value);
    const onNotifications = ({ value }) => setLiveNotifications(value);

    socket.on("sensor_changed", onSensor);
    socket.on("actuator_changed", onActuator);
    socket.on("crop_changed", onCrop);
    socket.on("warning_changed", onWarning);
    socket.on("recommendation_changed", onRecommendation);
    socket.on("weather_changed", onWeather);
    socket.on("notifications_changed", onNotifications);

    return () => {
      socket.off("sensor_changed", onSensor);
      socket.off("actuator_changed", onActuator);
      socket.off("crop_changed", onCrop);
      socket.off("warning_changed", onWarning);
      socket.off("recommendation_changed", onRecommendation);
      socket.off("weather_changed", onWeather);
      socket.off("notifications_changed", onNotifications);
    };
  }, [socket]);

  return {
    liveSensors,
    liveActuators,
    liveCrop,
    liveWarnings,
    liveRecommendation,
    liveWeather,
    liveNotifications,
  };
}