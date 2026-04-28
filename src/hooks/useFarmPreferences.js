import { useMemo } from "react";
import i18n from "../i18n";
import {
  profileSettingOptions,
  NORMALIZED_USER,
} from "../utilities/data/profileSettings";
import {
  DASHBOARD_CROP_DEFAULTS,
  DASHBOARD_DEFAULT_UNITS,
} from "../utilities/data/dashboardData";
import { STORAGE_KEYS } from "../utilities/data/storageKeys";
import usePersistentState from "./usePersistentState";
import { supabase } from "../supabaseClient";

const FARM_PREFERENCES_DEFAULTS = {
  mode:
    DASHBOARD_CROP_DEFAULTS.mode ||
    NORMALIZED_USER.farmSettings.mode ||
    "balanced",
  growthStage:
    DASHBOARD_CROP_DEFAULTS.growthStage ||
    NORMALIZED_USER.farmSettings.growth ||
    "Flowering",
  crop:
    DASHBOARD_CROP_DEFAULTS.crop ||
    NORMALIZED_USER.farmSettings.crop ||
    "Tomatoes",
  cropOptions: profileSettingOptions.cropOptions,
  temperatureUnit:
    DASHBOARD_DEFAULT_UNITS.temperatureUnit ||
    NORMALIZED_USER.displayUnits.temp ||
    "°C",
  humidityUnit:
    DASHBOARD_DEFAULT_UNITS.humidityUnit ||
    NORMALIZED_USER.displayUnits.hum ||
    "%",
  soilMoistureUnit:
    DASHBOARD_DEFAULT_UNITS.soilMoistureUnit ||
    NORMALIZED_USER.displayUnits.soil ||
    "%",
  lightIntensityUnit:
    DASHBOARD_DEFAULT_UNITS.lightIntensityUnit ||
    NORMALIZED_USER.displayUnits.light ||
    "lux",
  language: NORMALIZED_USER.displayUnits.language || "English",
};

const langMap = {
  English: "en",
  en: "en",
  Français: "fr",
  fr: "fr",
  French: "fr",
  french: "fr",
  العربية: "ar",
  ar: "ar",
  Arabic: "ar",
  arabic: "ar",
};

const getSavedLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.farmPreferences);
    if (stored) {
      const parsed = JSON.parse(stored);
      return (
        parsed?.language || FARM_PREFERENCES_DEFAULTS.language || "English"
      );
    }
  } catch {
    return FARM_PREFERENCES_DEFAULTS.language || "English";
  }
  return FARM_PREFERENCES_DEFAULTS.language || "English";
};

const savedLanguage = getSavedLanguage();
const savedCode = langMap[savedLanguage] || "en";
i18n.changeLanguage(savedCode);
document.documentElement.dir = savedCode === "ar" ? "rtl" : "ltr";

// Call backend to update a unit preference
const updateUnitOnBackend = async (name, unit) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("http://localhost:5000/api/settings/editUnit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ name, unit }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.error("Failed to update unit:", json.error);
    }
  } catch (err) {
    console.error("editUnit error:", err);
  }
};

// Call backend to update language preference
const updateLanguageOnBackend = async (language) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("http://localhost:5000/api/settings/editLanguage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ language }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.error("Failed to update language:", json.error);
    }
  } catch (err) {
    console.error("editLanguage error:", err);
  }
};

export default function useFarmPreferences() {
  const [preferences, setPreferences] = usePersistentState(
    STORAGE_KEYS.farmPreferences,
    FARM_PREFERENCES_DEFAULTS,
  );

  const safePreferences = useMemo(() => {
    const merged = {
      ...FARM_PREFERENCES_DEFAULTS,
      ...(preferences || {}),
    };

    const safeOptions =
      Array.isArray(merged.cropOptions) && merged.cropOptions.length
        ? merged.cropOptions
        : profileSettingOptions.cropOptions;

    return { ...merged, cropOptions: safeOptions };
  }, [preferences]);

  const setMode = (next) => setPreferences((prev) => ({ ...prev, mode: next }));
  const setGrowthStage = (next) =>
    setPreferences((prev) => ({ ...prev, growthStage: next }));
  const setCrop = (next) => setPreferences((prev) => ({ ...prev, crop: next }));

  // Unit setters — update local state AND call backend
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

    // Map code back to backend expected value
    const backendLang =
      code === "ar" ? "arabic" : code === "fr" ? "french" : "english";
    updateLanguageOnBackend(backendLang);
  };

  const addCropOption = (nextCrop) => {
    const normalized = String(nextCrop || "").trim();
    if (!normalized) return;

    setPreferences((prev) => {
      const current = Array.isArray(prev?.cropOptions)
        ? prev.cropOptions
        : profileSettingOptions.cropOptions;
      const exists = current.some(
        (option) => option.toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) return prev;
      return { ...prev, cropOptions: [...current, normalized] };
    });
  };

  return {
    ...safePreferences,
    setMode,
    setGrowthStage,
    setCrop,
    addCropOption,
    setTemperatureUnit,
    setHumidityUnit,
    setSoilMoistureUnit,
    setLightIntensityUnit,
    setLanguage,
  };
}
