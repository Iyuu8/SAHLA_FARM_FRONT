export const SENSOR_OPTIONS = [
  { id: 'temperature', label: 'Temperature', unit: '°C' },
  { id: 'humidity', label: 'Humidity', unit: '%' },
  { id: 'soilMoisture', label: 'Soil Moisture', unit: '%' },
  { id: 'lightIntensity', label: 'Light Intensity', unit: 'lux' },
];

export const SENSOR_SERIES = {
  temperature: {
    today: [
      { label: '06:00', value: 18 },
      { label: '09:00', value: 22 },
      { label: '12:00', value: 25 },
      { label: '15:00', value: 21 },
      { label: '18:00', value: 23 },
      { label: '21:00', value: 20 },
    ],
    threeDays: [
      { label: 'Mon', value: 19 },
      { label: 'Tue', value: 24 },
      { label: 'Wed', value: 21 },
    ],
    week: [
      { label: 'Sun', value: 18 },
      { label: 'Mon', value: 11 },
      { label: 'Tue', value: 22 },
      { label: 'Wed', value: 42 },
      { label: 'Thu', value: 49 },
      { label: 'Fri', value: 36 },
      { label: 'Sat', value: 40 },
    ],
  },
  humidity: {
    today: [
      { label: '06:00', value: 42 },
      { label: '09:00', value: 45 },
      { label: '12:00', value: 41 },
      { label: '15:00', value: 47 },
      { label: '18:00', value: 49 },
      { label: '21:00', value: 44 },
    ],
    threeDays: [
      { label: 'Mon', value: 46 },
      { label: 'Tue', value: 41 },
      { label: 'Wed', value: 49 },
    ],
    week: [
      { label: 'Sun', value: 38 },
      { label: 'Mon', value: 41 },
      { label: 'Tue', value: 39 },
      { label: 'Wed', value: 46 },
      { label: 'Thu', value: 44 },
      { label: 'Fri', value: 50 },
      { label: 'Sat', value: 48 },
    ],
  },
  soilMoisture: {
    today: [
      { label: '06:00', value: 30 },
      { label: '09:00', value: 26 },
      { label: '12:00', value: 23 },
      { label: '15:00', value: 20 },
      { label: '18:00', value: 24 },
      { label: '21:00', value: 29 },
    ],
    threeDays: [
      { label: 'Mon', value: 28 },
      { label: 'Tue', value: 25 },
      { label: 'Wed', value: 22 },
    ],
    week: [
      { label: 'Sun', value: 35 },
      { label: 'Mon', value: 33 },
      { label: 'Tue', value: 30 },
      { label: 'Wed', value: 26 },
      { label: 'Thu', value: 22 },
      { label: 'Fri', value: 25 },
      { label: 'Sat', value: 29 },
    ],
  },
  lightIntensity: {
    today: [
      { label: '06:00', value: 4 },
      { label: '09:00', value: 12 },
      { label: '12:00', value: 22 },
      { label: '15:00', value: 18 },
      { label: '18:00', value: 9 },
      { label: '21:00', value: 2 },
    ],
    threeDays: [
      { label: 'Mon', value: 13 },
      { label: 'Tue', value: 15 },
      { label: 'Wed', value: 11 },
    ],
    week: [
      { label: 'Sun', value: 10 },
      { label: 'Mon', value: 12 },
      { label: 'Tue', value: 9 },
      { label: 'Wed', value: 16 },
      { label: 'Thu', value: 20 },
      { label: 'Fri', value: 14 },
      { label: 'Sat', value: 11 },
    ],
  },
};

export const CHART_RANGE_OPTIONS = [
  { key: 'today', label: 'today' },
  { key: 'threeDays', label: 'last 3 days' },
  { key: 'week', label: 'this week' },
];

export const CHART_Y_TICKS = [-5, 15, 35, 55];

export const INITIAL_ACTUATORS = [
  {
    id: 'pump',
    name: 'Pump',
    status: 'on',
    mode: 'semi-auto',
    schedule: 'Running until 17:00',
  },
  {
    id: 'fan',
    name: 'Fan',
    status: 'off',
    mode: 'semi-auto',
    schedule: 'Execute at 18:00',
  },
];

export const DEFAULT_SELECTED_SENSOR_ID = 'temperature';

export const INITIAL_WARNINGS = [
  {
    id: '1',
    title: 'high_temperature_detected',
    status: 'active',
    severity: 85,
    description:
      'High temperatures have been detected in the monitored area, which can cause plant stress, increased water loss, and reduced crop productivity. Prolonged exposure may damage plant tissues and accelerate soil drying. Consider improving ventilation, providing shade if possible, and ensuring adequate irrigation.',
  },
  {
    id: '2',
    title: 'frost_risk',
    status: 'active',
    severity: 50,
    description:
      'Temperatures have dropped to dangerously low levels, posing a significant risk of frost formation. Frost can damage or destroy plant cells, leading to wilting, discoloration, and crop loss. Consider activating heating systems, covering vulnerable crops, and monitoring soil temperature closely.',
  },
  {
    id: '3',
    title: 'low_soil_moisture',
    status: 'active',
    severity: 60,
    description:
      'Soil moisture levels have fallen below the optimal threshold for healthy plant growth. Insufficient moisture restricts nutrient uptake and can stunt root development. Begin irrigation promptly and consider mulching to retain soil moisture and reduce further evaporation.',
  },
  {
    id: '4',
    title: 'overwatering',
    status: 'active',
    severity: 80,
    description:
      'Soil moisture levels have exceeded safe thresholds, indicating overwatering or poor drainage. Excess water displaces oxygen from the soil, suffocating roots and promoting harmful fungi and root rot. Suspend irrigation immediately and improve drainage if possible.',
  },
];
