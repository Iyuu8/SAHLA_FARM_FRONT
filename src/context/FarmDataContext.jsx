import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const FarmDataContext = createContext(null);

export function FarmDataProvider({ children }) {
  const { socket } = useSocket();

  const [farmData, setFarmData] = useState({
    crop: null,
    sensors: [],
    warnings: [],
    actuators: [],
    weather: null,
    recommendation: null,
  });

  useEffect(() => {
    if (!socket) return;

    // 1. AUTH SUCCESS → initial snapshot
    socket.on("auth_success", (data) => {
      console.log("Initial farm snapshot:", data);

      // IMPORTANT: backend should ideally send full state here
      setFarmData((prev) => ({
        ...prev,
        ...data.initial_state, // if your backend provides it
      }));
    });

    // 2. Crop updates
    socket.on("crop_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        crop: update.value,
      }));
    });

    // 3. Sensors updates
    socket.on("sensor_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        sensors: update.data,
      }));
    });

    // 4. Actuators updates
    socket.on("actuator_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        actuators: update.data,
      }));
    });

    // 5. Warnings updates
    socket.on("warning_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        warnings: update.data,
      }));
    });

    // 6. Weather updates
    socket.on("weather_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        weather: update.data,
      }));
    });

    // 7. Recommendation updates
    socket.on("recommendation_changed", (update) => {
      setFarmData((prev) => ({
        ...prev,
        recommendation: update.data,
      }));
    });

    return () => {
      socket.off("auth_success");
      socket.off("crop_changed");
      socket.off("sensor_changed");
      socket.off("actuator_changed");
      socket.off("warning_changed");
      socket.off("weather_changed");
      socket.off("recommendation_changed");
    };
  }, [socket]);

  return (
    <FarmDataContext.Provider value={{ farmData, setFarmData }}>
      {children}
    </FarmDataContext.Provider>
  );
}

export function useFarmData() {
  return useContext(FarmDataContext);
}