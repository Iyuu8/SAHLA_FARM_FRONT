import React, { createContext, useContext, useMemo, useEffect } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { useSocket } from './SocketContext';
import useLiveState from '../hooks/useLiveState';
import { STORAGE_KEYS } from '../utilities/data/storageKeys';
import { translateText } from '../utilities/functions/translateText';
import { supabase } from '../supabaseClient';
import i18n from "../i18n";
import { DASHBOARD_SENSOR_OPTIONS, DASHBOARD_CROP_DEFAULTS, DASHBOARD_DEFAULT_UNITS } from '../utilities/data/dashboardData';
import { NORMALIZED_USER, profileSettingOptions } from "../utilities/data/profileSettings";
const API_URL = process.env.REACT_APP_API_URL;
// --- Keep your original defaults and helpers ---
const FARM_PREFERENCES_DEFAULTS = {
  mode: DASHBOARD_CROP_DEFAULTS.mode || NORMALIZED_USER.farmSettings.mode || "Balanced",
  growthStage: DASHBOARD_CROP_DEFAULTS.growthStage || NORMALIZED_USER.farmSettings.growth || "Flowering",
  crop: DASHBOARD_CROP_DEFAULTS.crop || NORMALIZED_USER.farmSettings.crop || "Tomatoes",
  cropOptions: profileSettingOptions.cropOptions,
  temperatureUnit: DASHBOARD_DEFAULT_UNITS.temperatureUnit || NORMALIZED_USER.displayUnits.temp || "°C",
  humidityUnit: DASHBOARD_DEFAULT_UNITS.humidityUnit || NORMALIZED_USER.displayUnits.hum || "%",
  soilMoistureUnit: DASHBOARD_DEFAULT_UNITS.soilMoistureUnit || NORMALIZED_USER.displayUnits.soil || "%",
  lightIntensityUnit: DASHBOARD_DEFAULT_UNITS.lightIntensityUnit || NORMALIZED_USER.displayUnits.light || "lux",
  language: NORMALIZED_USER.displayUnits.language || "English",
};

const langMap = {
  English: "en", en: "en", Français: "fr", fr: "fr", French: "fr", french: "fr", العربية: "ar", ar: "ar", Arabic: "ar", arabic: "ar",
};

// Backend Helpers
const updateUnitOnBackend = async (name, unit) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${API_URL}/settings/editUnit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ name, unit }),
    });
  } catch (err) { console.error("editUnit error:", err); }
};

const updateLanguageOnBackend = async (language) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${API_URL}/settings/editLanguage`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ language }),
    });
  } catch (err) { console.error("editLanguage error:", err); }
};


const FarmContext = createContext();

export function FarmProvider({ children }) {
  const [preferences, setPreferences] = usePersistentState(
    STORAGE_KEYS.farmPreferences,
    FARM_PREFERENCES_DEFAULTS
  );
  
  const { socket, isAuthenticated } = useSocket();
  const { liveCrop } = useLiveState(DASHBOARD_SENSOR_OPTIONS); 

  // 1. Sync live data automatically
  useEffect(() => {
    if (!liveCrop) return;
    setPreferences(prev => {
      const nextCrop = liveCrop.type ?? prev.crop;
      const nextStage = liveCrop.growth_stage ?? prev.growthStage;
      const nextMode = liveCrop.mode ?? prev.mode;

      if (prev.crop === nextCrop && prev.growthStage === nextStage && prev.mode === nextMode) {
        return prev;
      }

      return {
        ...prev,
        crop: nextCrop,
        growthStage: nextStage,
        mode: nextMode
      };
    });
  }, [liveCrop, setPreferences]);

  // 2. Helper to emit changes
  const emitCropChange = (field, value, options = {}) => {
    if (options.silent || !socket || !isAuthenticated) return;
    socket.emit("set_entity", { type: "crop", payload: { field, value } });
  };

  // 3. Farm Setters
  const setCrop = (next, options) => {
    setPreferences(prev => ({ ...prev, crop: next }));
    emitCropChange("type", next, options);
  };

  const setGrowthStage = (next, options) => {
    setPreferences(prev => ({ ...prev, growthStage: next }));
    emitCropChange("growth_stage", next, options);
  };

  const setMode = (next, options) => {
    setPreferences(prev => ({ ...prev, mode: next }));
    emitCropChange("mode", next, options);  
  }

  // Merged AddCrop Logic
  const addCropOption = async (newCropName) => {
    const trimmed = String(newCropName || "").trim();
    if (!trimmed) return;

    // Always save in English regardless of the app's current language
    const englishName = await translateText(trimmed, 'en');
    const nameToSave = englishName?.trim() || trimmed;

    // 1. Update local UI array
    setPreferences((prev) => {
      const current = Array.isArray(prev?.cropOptions) ? prev.cropOptions : profileSettingOptions.cropOptions;
      if (current.some((opt) => opt.toLowerCase() === nameToSave.toLowerCase())) return prev;
      return { ...prev, cropOptions: [...current, nameToSave] };
    });

    // 2. Emit to backend via socket
    if (socket && isAuthenticated) {
      socket.emit('add_crop', { newCropName: nameToSave });
    }
  };

  // 4. Unit & Language Setters
  const setTemperatureUnit = (next) => {
    setPreferences((prev) => ({ ...prev, temperatureUnit: next }));
    updateUnitOnBackend("temperature", next);
  };

  const setHumidityUnit = (next) => {
    setPreferences((prev) => ({ ...prev, humidityUnit: next }));
    updateUnitOnBackend("humidity", next);
  };

  const setSoilMoistureUnit = (next) => {
    setPreferences((prev) => ({ ...prev, soilMoistureUnit: next }));
    updateUnitOnBackend("soil moisture", next);
  };

  const setLightIntensityUnit = (next) => {
    setPreferences((prev) => ({ ...prev, lightIntensityUnit: next }));
    updateUnitOnBackend("luminosity", next);
  };

  const setLanguage = (next) => {
    const code = langMap[next] || "en";
    i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    setPreferences((prev) => ({ ...prev, language: code }));

    const backendLang = code === "ar" ? "arabic" : code === "fr" ? "french" : "english";
    updateLanguageOnBackend(backendLang);
  };

  // 5. Expose everything properly
  const value = useMemo(() => ({
    ...preferences,
    setCrop,
    setGrowthStage,
    setMode,
    addCropOption,
    setTemperatureUnit,
    setHumidityUnit,
    setSoilMoistureUnit,
    setLightIntensityUnit,
    setLanguage
  }), [preferences]);

  return (
    <FarmContext.Provider value={value}>
      {children}
    </FarmContext.Provider>
  );
}

export default function useFarmPreferences() {
  return useContext(FarmContext);
}