const sensorDictionary = {
  temperature: { id: "temperature", label: "Temperature", unit: "°C", iconKey: "thermometer" },
  "soil moisture": { id: "soilMoisture", label: "Soil Moisture", unit: "%", iconKey: "droplets" },
  "air humidity": { id: "humidity", label: "Humidity", unit: "%", iconKey: "wind" },
  "light intensity": { id: "lightIntensity", label: "Light Intensity", unit: "K lux", iconKey: "sun" },
};

const actuatorDictionary = {
  pump: { id: "pump", label: "Pump", iconKey: "sprout" },
  fan: { id: "fan", label: "Fan", iconKey: "fan" },
};

const warningDictionary = {
  "high temperature detected": { iconKey: "thermometer", message: "please consider ventilation" },
  "frost risk": { iconKey: "snowflake", message: "low temperature warning" },
  "low soil moisture": { iconKey: "droplet", message: "irrigation recommended" },
  overwatering: { iconKey: "waves", message: "high soil moisture warning" },
  "heavy rainfall": { iconKey: "cloud-rain", message: "check field drainage" },
  "high humidity level": { iconKey: "cloud", message: "risk of fungal growth" },
  "insufficient sunlight": { iconKey: "sun-dim", message: "growth may be affected" },
  "excessive sunlight": { iconKey: "sun", message: "protect crops from UV" },
  "strong wind": { iconKey: "wind", message: "secure structures and crops" },
};

const weekLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function createMockSeries(baseValue, variance, labels) {
  return labels.map((label, index) => {
    const wave = Math.sin(index * 0.9) * variance;
    const trend = index * (variance * 0.35);
    return {
      label,
      value: Math.max(0, Math.round(baseValue + wave + trend)),
    };
  });
}

function createSensorSeries(sensor) {
  const normalized = sensor.name.toLowerCase();
  const base = sensor.value;

  if (normalized === "temperature") {
    return {
      today: createMockSeries(base - 4, 2, ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]),
      week: [18, 11, 22, 42, 49, 36, 40].map((value, idx) => ({ label: weekLabels[idx], value })),
      month: createMockSeries(base - 8, 5, ["W1", "W2", "W3", "W4"]),
    };
  }

  if (normalized === "soil moisture") {
    return {
      today: createMockSeries(base - 3, 4, ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]),
      week: createMockSeries(base, 6, weekLabels),
      month: createMockSeries(base - 5, 8, ["W1", "W2", "W3", "W4"]),
    };
  }

  if (normalized === "air humidity") {
    return {
      today: createMockSeries(base, 3, ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]),
      week: createMockSeries(base + 4, 5, weekLabels),
      month: createMockSeries(base + 2, 6, ["W1", "W2", "W3", "W4"]),
    };
  }

  return {
    today: createMockSeries(base + 2, 8, ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]),
    week: createMockSeries(base + 6, 10, weekLabels),
    month: createMockSeries(base + 4, 12, ["W1", "W2", "W3", "W4"]),
  };
}

export function transformDashboardData(payload) {
  const source = payload ?? {
    state: {},
    sensors: [],
    actuators: [],
    warnings: [],
    recommendation: "",
  };

  const sensors = (source.sensors || []).map((sensor, index) => {
    const key = sensor.name.toLowerCase();
    const meta = sensorDictionary[key] || {
      id: `sensor-${index}`,
      label: sensor.name,
      unit: "",
      iconKey: "circle",
    };

    return {
      ...meta,
      value: sensor.value,
      description: sensor.description,
      raw: sensor,
      series: createSensorSeries(sensor),
    };
  });

  const actuators = (source.actuators || []).map((actuator, index) => {
    const key = actuator.name.toLowerCase();
    const meta = actuatorDictionary[key] || {
      id: `actuator-${index}`,
      label: actuator.name,
      iconKey: "cpu",
    };

    return {
      ...meta,
      physicalState: actuator.physical_state,
      controlMode: actuator.control_mode,
      timer: actuator.timer,
      delay: actuator.delay,
      raw: actuator,
    };
  });

  const warnings = (source.warnings || []).map((warning, index) => {
    const key = warning.name.toLowerCase();
    const meta = warningDictionary[key] || {
      iconKey: "triangle-alert",
      message: "Please review environmental conditions",
    };

    return {
      id: `warning-${index}`,
      label: warning.name,
      active: warning.active,
      severity: warning.severity,
      description: warning.description,
      helperText: meta.message,
      iconKey: meta.iconKey,
      raw: warning,
    };
  });

  return {
    rawPayload: source,
    state: {
      growthMode: source.state?.growth_mode || "balanced",
      crop: source.state?.crop || "tomatoes",
      growthStage: source.state?.growth_stage || "seed stage",
      timeOfDay: source.state?.time_of_day || "00:00",
      raw: source.state,
    },
    sensors,
    actuators,
    warnings,
    recommendation: source.recommendation || "",
  };
}
