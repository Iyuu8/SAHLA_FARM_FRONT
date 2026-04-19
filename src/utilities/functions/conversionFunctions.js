const LIGHT_FC_PER_LUX = 1 / 10.7639;

const toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return NaN;

  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return NaN;

  if (trimmed.endsWith('k')) {
    const parsed = Number(trimmed.slice(0, -1));
    return Number.isFinite(parsed) ? parsed * 1000 : NaN;
  }

  const parsed = Number(trimmed.replace(/[^0-9.+-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
};

const roundTo = (value, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const normalizeUnit = (unit) => {
  if (!unit) return '';
  const normalized = String(unit).trim().toLowerCase();
  if (normalized === 'lx') return 'lux';
  return normalized;
};

export function convertTemperature(valueC, targetUnit = '°C') {
  const celsius = toNumber(valueC);
  if (!Number.isFinite(celsius)) return NaN;

  if (targetUnit === '°F') return roundTo((celsius * 9) / 5 + 32, 1);
  if (targetUnit === 'K') return roundTo(celsius + 273.15, 2);
  return roundTo(celsius, 1);
}

function estimateAbsoluteHumidity(tempC, relativeHumidity) {
  const t = toNumber(tempC);
  const rh = toNumber(relativeHumidity);
  if (!Number.isFinite(t) || !Number.isFinite(rh)) return NaN;

  // Approximation based on saturation vapor pressure at temperature T (C).
  const sat = 6.112 * Math.exp((17.67 * t) / (t + 243.5));
  const vap = (rh / 100) * sat;
  return roundTo((2.1674 * vap) / (273.15 + t) * 100, 1);
}

export function convertHumidity(valuePercent, targetUnit = '%', tempCForConversion = 25) {
  const relative = toNumber(valuePercent);
  if (!Number.isFinite(relative)) return NaN;

  if (targetUnit === 'g/m³') {
    return estimateAbsoluteHumidity(tempCForConversion, relative);
  }

  return roundTo(relative, 1);
}

export function convertSoilMoisture(valuePercent, targetUnit = '%') {
  const moisture = toNumber(valuePercent);
  if (!Number.isFinite(moisture)) return NaN;

  if (targetUnit === '%') return roundTo(moisture, 1);
  return roundTo(moisture, 1);
}

export function convertLightIntensity(valueLux, targetUnit = 'lux') {
  const lux = toNumber(valueLux);
  if (!Number.isFinite(lux)) return NaN;

  const normalizedUnit = normalizeUnit(targetUnit);
  if (normalizedUnit === 'fc') return roundTo(lux * LIGHT_FC_PER_LUX, 1);
  if (normalizedUnit === 'lm') {
    // Without a known area, we assume a 1 m^2 surface so lux ~= lumens.
    return roundTo(lux, 1);
  }
  return roundTo(lux, 1);
}

export function formatConvertedValue(value, unit, digits = 1) {
  if (!Number.isFinite(value)) return `-- ${unit || ''}`.trim();
  const rounded = roundTo(value, digits);
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${text}${unit || ''}`;
}

export function splitReading(reading) {
  if (typeof reading !== 'string') {
    return { value: toNumber(reading), unit: '' };
  }

  const match = reading.trim().match(/^([-+]?\d*\.?\d+)\s*(.*)$/);
  if (!match) return { value: NaN, unit: '' };

  return {
    value: Number(match[1]),
    unit: match[2] || '',
  };
}

export function convertSensorValueById(sensorId, baseValue, units, tempCForHumidity = 25) {
  if (sensorId === 'temperature') {
    const unit = units.temperatureUnit || '°C';
    return { value: convertTemperature(baseValue, unit), unit };
  }

  if (sensorId === 'humidity') {
    const unit = units.humidityUnit || '%';
    return { value: convertHumidity(baseValue, unit, tempCForHumidity), unit };
  }

  if (sensorId === 'soilMoisture') {
    const unit = units.soilMoistureUnit || '%';
    return { value: convertSoilMoisture(baseValue, unit), unit };
  }

  if (sensorId === 'lightIntensity') {
    const unit = units.lightIntensityUnit || 'lux';
    return { value: convertLightIntensity(baseValue, unit), unit };
  }

  return { value: toNumber(baseValue), unit: '' };
}