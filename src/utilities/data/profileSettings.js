

export const USER_INFO = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "Ayoub",
  email: "anesbenaziza42@gmail.com",
  age: 24,
  address: "Sidi Bel Abbes, Algeria",
  avatarUrl: "https://images5.alphacoders.com/100/1005348.jpg",
  haUrl: "http://sahla-homeassistant.local:8123",
  preferences: {
    displayUnits: {
      temperature: "°C",
      humidity: "%",
      soilMoisture: "%",
      luminosity: "lux"
    },
    language: "English"
  },
  farmSettings: {
    crop: "tomatoes",
    mode: "balanced",
    growthStage: "flowering"
  }
};

// Normalization helpers keep UI defaults stable even if backend values vary in case/format.
const toTitleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeMode = (value) => String(value || '').replace(/_/g, ' ').trim();

const normalizeUnit = (value, fallback) => {
  const normalized = String(value || '').trim();
  if (!normalized) return fallback;
  if (normalized.toLowerCase() === 'lx') return 'lux';
  if (normalized.toLowerCase() === 'lux') return 'lux';
  return normalized;
};

// App-facing adapter derived from backend-shaped USER_INFO.
// Consumers should use this normalized object instead of reading USER_INFO directly.
export const NORMALIZED_USER = {
  id: USER_INFO.id || '',
  userName: USER_INFO.username || '',
  email: USER_INFO.email || '',
  age: USER_INFO.age ?? '',
  address: USER_INFO.address ?? '',
  pfp: USER_INFO.avatarUrl || '',
  // Kept as "homeAssistantId" for compatibility with existing settings connection UI.
  homeAssistantId: USER_INFO.haUrl || '',
  displayUnits: {
    // Legacy keys still used by existing pages/components.
    temp: normalizeUnit(USER_INFO.preferences?.displayUnits?.temperature, '°C'),
    hum: normalizeUnit(USER_INFO.preferences?.displayUnits?.humidity, '%'),
    soil: normalizeUnit(USER_INFO.preferences?.displayUnits?.soilMoisture, '%'),
    light: normalizeUnit(USER_INFO.preferences?.displayUnits?.luminosity, 'lux'),
    language: USER_INFO.preferences?.language || 'English',
    // New semantic keys available for future consumers.
    temperature: normalizeUnit(USER_INFO.preferences?.displayUnits?.temperature, '°C'),
    humidity: normalizeUnit(USER_INFO.preferences?.displayUnits?.humidity, '%'),
    soilMoisture: normalizeUnit(USER_INFO.preferences?.displayUnits?.soilMoisture, '%'),
    luminosity: normalizeUnit(USER_INFO.preferences?.displayUnits?.luminosity, 'lux'),
  },
  farmSettings: {
    crop: toTitleCase(USER_INFO.farmSettings?.crop),
    mode: normalizeMode(USER_INFO.farmSettings?.mode),
    // Both keys are exposed because some components still read "growth".
    growth: toTitleCase(USER_INFO.farmSettings?.growthStage),
    growthStage: toTitleCase(USER_INFO.farmSettings?.growthStage),
    // New backend model does not include manualControl, so we keep a safe UI default.
    manualControl: 'off',
  },
  raw: USER_INFO,
};

// Backward-compatible alias used by existing imports.
export const user = NORMALIZED_USER;

export const profileSettingOptions = {
    modeOptions: ['balanced', 'water saving', 'energy saving', 'growth priority'],
    manualControlOptions: ['on', 'off'],
    growthStageOptions: ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting', 'Maturity'],
    cropOptions: ['Tomato', 'Lettuce', 'Cucumber', 'Peas', 'Barley', 'Pepper', 'Rice', 'Carrot', 'Corn', 'Wheat'],
    languageOptions: ['English', 'العربية', 'french'],
    temperatureOptions: [
        { value: '°C', label: 'Celsius °C' },
        { value: '°F', label: 'Fahrenheit °F' },
        { value: 'K', label: 'Kelvin K' },
    ],
    humidityOptions: [
        { value: '%', label: 'Humidity %' },
        { value: 'g/m³', label: 'Abs. Humidity g/m³' },
    ],
    soilMoistureOptions: [
        { value: '%', label: 'Soil Moisture %' },
    ],
    lightIntensityOptions: [
        { value: 'lux', label: 'Lux (lux)' },
        { value: 'fc', label: 'Foot-candle (fc)' },
        { value: 'lm', label: 'Lumen (lm)' },
    ],
}


