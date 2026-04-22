// ─── SENSOR OPTIONS ────────────────────────────────────────────────────────────
// Each sensor now carries a currentValue and description shown on the SensorCard.
export const FARM_INFO = {
  "crop": {
    "type": "tomatoes",
    "mode": "growth_priority",
    "growth_stage": "flowering"
  },
  "sensors": [
    { 
      "id": "sen-sm-01", 
      "type": "soil_moisture", 
      "unit": "%", 
      "value": 45.2, 
      "description": "The soil has adequate water, keeping the roots well hydrated." 
    },
    { 
      "id": "sen-tmp-01", 
      "type": "temperature", 
      "unit": "°C", 
      "value": 24.5, 
      "description": "The temperature is optimal, ensuring safe and steady plant growth." 
    },
    { 
      "id": "sen-hum-01", 
      "type": "air_humidity", 
      "unit": "%", 
      "value": 65.0, 
      "description": "The air humidity is moderate, preventing leaves from drying out." 
    },
    { 
      "id": "sen-li-01", 
      "type": "light_intensity", 
      "unit": "Lux", 
      "value": 1450, 
      "description": "The light is bright, providing excellent energy for photosynthesis." 
    }
  ],
  "actuators": [
    {
      "id": "act-pmp-01",
      "type": "pump",
      "status": "off",
      "control_mode": "auto",
      "run_at": "2026-04-18T08:00",
      "duration_minutes": 20,
      "run_until": "2026-04-18T08:20"
    },
    {
      "id": "act-fan-01",
      "type": "fan",
      "status": "on",
      "control_mode": "semi_auto",
      "run_at": "2026-04-18T14:00",
      "duration_minutes": 30,
      "run_until": "2026-04-18T14:30"
    }
  ],
  "warnings": [
    {
      "id": "warn-fr-01",
      "title": "frost_risk",
      "status": "inactive",
      "description": "Low temperatures can cause frost damage to plant cells, leading to wilting and crop loss. Currently inactive as temperatures remain safely above freezing.",
      "severity": 15
    },
    {
      "id": "warn-hr-01",
      "title": "heavy_rainfall",
      "status": "active",
      "severity": 75,
      "description": "Heavy rainfall is expected in the next 12 hours. Ensure greenhouse roof vents are properly closed and external drainage systems are unblocked."
    }
  ],
  "recommendation": "The environment is stable for the flowering stage. The fan is currently active to maintain proper airflow and prevent fungal diseases. Keep monitoring the external rainfall to ensure no leaks affect the humidity levels."
};

// ─── SENSOR SERIES ──────────────────────────────────────────────────────────────
export const SENSOR_SERIES = [
  {
    "sensor": {
      "type": "temperature",
      "unit": "°C"
    },
    "data": [
      { "id": "te1", "timestamp": "2026-04-11T18:00:00", "value": 24.0 },
      { "id": "te2", "timestamp": "2026-04-11T21:00:00", "value": 18.8 },
      { "id": "te3", "timestamp": "2026-04-12T00:00:00", "value": 17.1 },
      { "id": "te4", "timestamp": "2026-04-12T03:00:00", "value": 15.9 },
      { "id": "te5", "timestamp": "2026-04-12T06:00:00", "value": 20.8 },
      { "id": "te6", "timestamp": "2026-04-12T09:00:00", "value": 25.2 },
      { "id": "te7", "timestamp": "2026-04-12T12:00:00", "value": 28.7 },
      { "id": "te8", "timestamp": "2026-04-12T15:00:00", "value": 27.0 },
      { "id": "te9", "timestamp": "2026-04-12T18:00:00", "value": 23.4 },
      { "id": "te10", "timestamp": "2026-04-12T21:00:00", "value": 19.4 },
      { "id": "te11", "timestamp": "2026-04-13T00:00:00", "value": 16.9 },
      { "id": "te12", "timestamp": "2026-04-13T03:00:00", "value": 17.8 },
      { "id": "te13", "timestamp": "2026-04-13T06:00:00", "value": 21.2 },
      { "id": "te14", "timestamp": "2026-04-13T09:00:00", "value": 25.6 },
      { "id": "te15", "timestamp": "2026-04-13T12:00:00", "value": 27.1 },
      { "id": "te16", "timestamp": "2026-04-13T15:00:00", "value": 27.6 },
      { "id": "te17", "timestamp": "2026-04-13T18:00:00", "value": 23.8 },
      { "id": "te18", "timestamp": "2026-04-13T21:00:00", "value": 18.9 },
      { "id": "te19", "timestamp": "2026-04-14T00:00:00", "value": 17.2 },
      { "id": "te20", "timestamp": "2026-04-14T03:00:00", "value": 16.3 },
      { "id": "te21", "timestamp": "2026-04-14T06:00:00", "value": 19.5 },
      { "id": "te22", "timestamp": "2026-04-14T09:00:00", "value": 25.5 },
      { "id": "te23", "timestamp": "2026-04-14T12:00:00", "value": 26.9 },
      { "id": "te24", "timestamp": "2026-04-14T15:00:00", "value": 27.5 },
      { "id": "te25", "timestamp": "2026-04-14T18:00:00", "value": 23.8 },
      { "id": "te26", "timestamp": "2026-04-14T21:00:00", "value": 18.9 },
      { "id": "te27", "timestamp": "2026-04-15T00:00:00", "value": 17.1 },
      { "id": "te28", "timestamp": "2026-04-15T03:00:00", "value": 16.2 },
      { "id": "te29", "timestamp": "2026-04-15T06:00:00", "value": 21.1 },
      { "id": "te30", "timestamp": "2026-04-15T09:00:00", "value": 25.4 },
      { "id": "te31", "timestamp": "2026-04-15T12:00:00", "value": 28.2 },
      { "id": "te32", "timestamp": "2026-04-15T15:00:00", "value": 28.2 },
      { "id": "te33", "timestamp": "2026-04-15T18:00:00", "value": 23.0 },
      { "id": "te34", "timestamp": "2026-04-15T21:00:00", "value": 18.7 },
      { "id": "te35", "timestamp": "2026-04-16T00:00:00", "value": 15.3 },
      { "id": "te36", "timestamp": "2026-04-16T03:00:00", "value": 16.3 },
      { "id": "te37", "timestamp": "2026-04-16T06:00:00", "value": 20.2 },
      { "id": "te38", "timestamp": "2026-04-16T09:00:00", "value": 25.2 },
      { "id": "te39", "timestamp": "2026-04-16T12:00:00", "value": 27.2 },
      { "id": "te40", "timestamp": "2026-04-16T15:00:00", "value": 26.7 },
      { "id": "te41", "timestamp": "2026-04-16T18:00:00", "value": 23.9 },
      { "id": "te42", "timestamp": "2026-04-16T21:00:00", "value": 19.4 },
      { "id": "te43", "timestamp": "2026-04-17T00:00:00", "value": 15.4 },
      { "id": "te44", "timestamp": "2026-04-17T03:00:00", "value": 16.3 },
      { "id": "te45", "timestamp": "2026-04-17T06:00:00", "value": 20.9 },
      { "id": "te46", "timestamp": "2026-04-17T09:00:00", "value": 25.0 },
      { "id": "te47", "timestamp": "2026-04-17T12:00:00", "value": 27.5 },
      { "id": "te48", "timestamp": "2026-04-17T15:00:00", "value": 27.6 },
      { "id": "te49", "timestamp": "2026-04-17T18:00:00", "value": 24.0 },
      { "id": "te50", "timestamp": "2026-04-17T21:00:00", "value": 18.6 },
      { "id": "te51", "timestamp": "2026-04-18T00:00:00", "value": 15.8 },
      { "id": "te52", "timestamp": "2026-04-18T03:00:00", "value": 17.1 },
      { "id": "te53", "timestamp": "2026-04-18T06:00:00", "value": 20.7 },
      { "id": "te54", "timestamp": "2026-04-18T09:00:00", "value": 25.6 },
      { "id": "te55", "timestamp": "2026-04-18T12:00:00", "value": 27.9 },
      { "id": "te56", "timestamp": "2026-04-18T15:00:00", "value": 26.7 },
      { "id": "te57", "timestamp": "2026-04-18T18:00:00", "value": 24.1 }
    ]
  },
  {
    "sensor": {
      "type": "air_humidity",
      "unit": "%"
    },
    "data": [
      { "id": "ai1", "timestamp": "2026-04-11T18:00:00", "value": 39.4 },
      { "id": "ai2", "timestamp": "2026-04-11T21:00:00", "value": 54.0 },
      { "id": "ai3", "timestamp": "2026-04-12T00:00:00", "value": 58.9 },
      { "id": "ai4", "timestamp": "2026-04-12T03:00:00", "value": 58.2 },
      { "id": "ai5", "timestamp": "2026-04-12T06:00:00", "value": 47.1 },
      { "id": "ai6", "timestamp": "2026-04-12T09:00:00", "value": 39.0 },
      { "id": "ai7", "timestamp": "2026-04-12T12:00:00", "value": 29.4 },
      { "id": "ai8", "timestamp": "2026-04-12T15:00:00", "value": 32.8 },
      { "id": "ai9", "timestamp": "2026-04-12T18:00:00", "value": 39.6 },
      { "id": "ai10", "timestamp": "2026-04-12T21:00:00", "value": 52.1 },
      { "id": "ai11", "timestamp": "2026-04-13T00:00:00", "value": 57.8 },
      { "id": "ai12", "timestamp": "2026-04-13T03:00:00", "value": 56.7 },
      { "id": "ai13", "timestamp": "2026-04-13T06:00:00", "value": 47.2 },
      { "id": "ai14", "timestamp": "2026-04-13T09:00:00", "value": 39.4 },
      { "id": "ai15", "timestamp": "2026-04-13T12:00:00", "value": 30.1 },
      { "id": "ai16", "timestamp": "2026-04-13T15:00:00", "value": 31.6 },
      { "id": "ai17", "timestamp": "2026-04-13T18:00:00", "value": 41.8 },
      { "id": "ai18", "timestamp": "2026-04-13T21:00:00", "value": 54.2 },
      { "id": "ai19", "timestamp": "2026-04-14T00:00:00", "value": 58.0 },
      { "id": "ai20", "timestamp": "2026-04-14T03:00:00", "value": 56.7 },
      { "id": "ai21", "timestamp": "2026-04-14T06:00:00", "value": 48.9 },
      { "id": "ai22", "timestamp": "2026-04-14T09:00:00", "value": 36.3 },
      { "id": "ai23", "timestamp": "2026-04-14T12:00:00", "value": 30.0 },
      { "id": "ai24", "timestamp": "2026-04-14T15:00:00", "value": 33.2 },
      { "id": "ai25", "timestamp": "2026-04-14T18:00:00", "value": 39.2 },
      { "id": "ai26", "timestamp": "2026-04-14T21:00:00", "value": 52.6 },
      { "id": "ai27", "timestamp": "2026-04-15T00:00:00", "value": 60.4 },
      { "id": "ai28", "timestamp": "2026-04-15T03:00:00", "value": 58.2 },
      { "id": "ai29", "timestamp": "2026-04-15T06:00:00", "value": 49.1 },
      { "id": "ai30", "timestamp": "2026-04-15T09:00:00", "value": 36.4 },
      { "id": "ai31", "timestamp": "2026-04-15T12:00:00", "value": 31.9 },
      { "id": "ai32", "timestamp": "2026-04-15T15:00:00", "value": 31.5 },
      { "id": "ai33", "timestamp": "2026-04-15T18:00:00", "value": 40.1 },
      { "id": "ai34", "timestamp": "2026-04-15T21:00:00", "value": 53.9 },
      { "id": "ai35", "timestamp": "2026-04-16T00:00:00", "value": 61.2 },
      { "id": "ai36", "timestamp": "2026-04-16T03:00:00", "value": 59.9 },
      { "id": "ai37", "timestamp": "2026-04-16T06:00:00", "value": 50.3 },
      { "id": "ai38", "timestamp": "2026-04-16T09:00:00", "value": 38.0 },
      { "id": "ai39", "timestamp": "2026-04-16T12:00:00", "value": 30.7 },
      { "id": "ai40", "timestamp": "2026-04-16T15:00:00", "value": 33.1 },
      { "id": "ai41", "timestamp": "2026-04-16T18:00:00", "value": 42.8 },
      { "id": "ai42", "timestamp": "2026-04-16T21:00:00", "value": 52.4 },
      { "id": "ai43", "timestamp": "2026-04-17T00:00:00", "value": 59.8 },
      { "id": "ai44", "timestamp": "2026-04-17T03:00:00", "value": 57.6 },
      { "id": "ai45", "timestamp": "2026-04-17T06:00:00", "value": 49.3 },
      { "id": "ai46", "timestamp": "2026-04-17T09:00:00", "value": 37.1 },
      { "id": "ai47", "timestamp": "2026-04-17T12:00:00", "value": 30.8 },
      { "id": "ai48", "timestamp": "2026-04-17T15:00:00", "value": 33.8 },
      { "id": "ai49", "timestamp": "2026-04-17T18:00:00", "value": 41.4 },
      { "id": "ai50", "timestamp": "2026-04-17T21:00:00", "value": 51.6 },
      { "id": "ai51", "timestamp": "2026-04-18T00:00:00", "value": 59.3 },
      { "id": "ai52", "timestamp": "2026-04-18T03:00:00", "value": 56.4 },
      { "id": "ai53", "timestamp": "2026-04-18T06:00:00", "value": 50.2 },
      { "id": "ai54", "timestamp": "2026-04-18T09:00:00", "value": 38.1 },
      { "id": "ai55", "timestamp": "2026-04-18T12:00:00", "value": 29.3 },
      { "id": "ai56", "timestamp": "2026-04-18T15:00:00", "value": 31.5 },
      { "id": "ai57", "timestamp": "2026-04-18T18:00:00", "value": 42.2 }
    ]
  },
  {
    "sensor": {
      "type": "soil_moisture",
      "unit": "%"
    },
    "data": [
      { "id": "so1", "timestamp": "2026-04-11T18:00:00", "value": 34.6 },
      { "id": "so2", "timestamp": "2026-04-11T21:00:00", "value": 33.5 },
      { "id": "so3", "timestamp": "2026-04-12T00:00:00", "value": 33.2 },
      { "id": "so4", "timestamp": "2026-04-12T03:00:00", "value": 32.5 },
      { "id": "so5", "timestamp": "2026-04-12T06:00:00", "value": 32.3 },
      { "id": "so6", "timestamp": "2026-04-12T09:00:00", "value": 31.4 },
      { "id": "so7", "timestamp": "2026-04-12T12:00:00", "value": 31.4 },
      { "id": "so8", "timestamp": "2026-04-12T15:00:00", "value": 31.0 },
      { "id": "so9", "timestamp": "2026-04-12T18:00:00", "value": 30.4 },
      { "id": "so10", "timestamp": "2026-04-12T21:00:00", "value": 30.1 },
      { "id": "so11", "timestamp": "2026-04-13T00:00:00", "value": 30.1 },
      { "id": "so12", "timestamp": "2026-04-13T03:00:00", "value": 29.3 },
      { "id": "so13", "timestamp": "2026-04-13T06:00:00", "value": 28.7 },
      { "id": "so14", "timestamp": "2026-04-13T09:00:00", "value": 27.5 },
      { "id": "so15", "timestamp": "2026-04-13T12:00:00", "value": 27.5 },
      { "id": "so16", "timestamp": "2026-04-13T15:00:00", "value": 26.8 },
      { "id": "so17", "timestamp": "2026-04-13T18:00:00", "value": 27.0 },
      { "id": "so18", "timestamp": "2026-04-13T21:00:00", "value": 25.9 },
      { "id": "so19", "timestamp": "2026-04-14T00:00:00", "value": 25.3 },
      { "id": "so20", "timestamp": "2026-04-14T03:00:00", "value": 25.9 },
      { "id": "so21", "timestamp": "2026-04-14T06:00:00", "value": 24.8 },
      { "id": "so22", "timestamp": "2026-04-14T09:00:00", "value": 24.0 },
      { "id": "so23", "timestamp": "2026-04-14T12:00:00", "value": 24.3 },
      { "id": "so24", "timestamp": "2026-04-14T15:00:00", "value": 23.5 },
      { "id": "so25", "timestamp": "2026-04-14T18:00:00", "value": 23.9 },
      { "id": "so26", "timestamp": "2026-04-14T21:00:00", "value": 22.8 },
      { "id": "so27", "timestamp": "2026-04-15T00:00:00", "value": 22.7 },
      { "id": "so28", "timestamp": "2026-04-15T03:00:00", "value": 22.1 },
      { "id": "so29", "timestamp": "2026-04-15T06:00:00", "value": 22.6 },
      { "id": "so30", "timestamp": "2026-04-15T09:00:00", "value": 21.6 },
      { "id": "so31", "timestamp": "2026-04-15T12:00:00", "value": 20.9 },
      { "id": "so32", "timestamp": "2026-04-15T15:00:00", "value": 20.1 },
      { "id": "so33", "timestamp": "2026-04-15T18:00:00", "value": 20.6 },
      { "id": "so34", "timestamp": "2026-04-15T21:00:00", "value": 37.8 },
      { "id": "so35", "timestamp": "2026-04-16T00:00:00", "value": 37.5 },
      { "id": "so36", "timestamp": "2026-04-16T03:00:00", "value": 37.2 },
      { "id": "so37", "timestamp": "2026-04-16T06:00:00", "value": 36.5 },
      { "id": "so38", "timestamp": "2026-04-16T09:00:00", "value": 35.8 },
      { "id": "so39", "timestamp": "2026-04-16T12:00:00", "value": 35.6 },
      { "id": "so40", "timestamp": "2026-04-16T15:00:00", "value": 35.0 },
      { "id": "so41", "timestamp": "2026-04-16T18:00:00", "value": 34.6 },
      { "id": "so42", "timestamp": "2026-04-16T21:00:00", "value": 33.3 },
      { "id": "so43", "timestamp": "2026-04-17T00:00:00", "value": 32.6 },
      { "id": "so44", "timestamp": "2026-04-17T03:00:00", "value": 32.3 },
      { "id": "so45", "timestamp": "2026-04-17T06:00:00", "value": 31.6 },
      { "id": "so46", "timestamp": "2026-04-17T09:00:00", "value": 31.0 },
      { "id": "so47", "timestamp": "2026-04-17T12:00:00", "value": 30.5 },
      { "id": "so48", "timestamp": "2026-04-17T15:00:00", "value": 31.0 },
      { "id": "so49", "timestamp": "2026-04-17T18:00:00", "value": 29.9 },
      { "id": "so50", "timestamp": "2026-04-17T21:00:00", "value": 29.6 },
      { "id": "so51", "timestamp": "2026-04-18T00:00:00", "value": 29.0 },
      { "id": "so52", "timestamp": "2026-04-18T03:00:00", "value": 28.5 },
      { "id": "so53", "timestamp": "2026-04-18T06:00:00", "value": 28.4 },
      { "id": "so54", "timestamp": "2026-04-18T09:00:00", "value": 27.9 },
      { "id": "so55", "timestamp": "2026-04-18T12:00:00", "value": 28.0 },
      { "id": "so56", "timestamp": "2026-04-18T15:00:00", "value": 26.9 },
      { "id": "so57", "timestamp": "2026-04-18T18:00:00", "value": 26.5 }
    ]
  },
  {
    "sensor": {
      "type": "light_intensity",
      "unit": "Lux"
    },
    "data": [
      { "id": "li1", "timestamp": "2026-04-11T18:00:00", "value": 834.7 },
      { "id": "li2", "timestamp": "2026-04-11T21:00:00", "value": 0 },
      { "id": "li3", "timestamp": "2026-04-12T00:00:00", "value": 0 },
      { "id": "li4", "timestamp": "2026-04-12T03:00:00", "value": 0 },
      { "id": "li5", "timestamp": "2026-04-12T06:00:00", "value": 410.9 },
      { "id": "li6", "timestamp": "2026-04-12T09:00:00", "value": 1067.7 },
      { "id": "li7", "timestamp": "2026-04-12T12:00:00", "value": 1498.1 },
      { "id": "li8", "timestamp": "2026-04-12T15:00:00", "value": 1379.0 },
      { "id": "li9", "timestamp": "2026-04-12T18:00:00", "value": 818.1 },
      { "id": "li10", "timestamp": "2026-04-12T21:00:00", "value": 0 },
      { "id": "li11", "timestamp": "2026-04-13T00:00:00", "value": 0 },
      { "id": "li12", "timestamp": "2026-04-13T03:00:00", "value": 0 },
      { "id": "li13", "timestamp": "2026-04-13T06:00:00", "value": 369.3 },
      { "id": "li14", "timestamp": "2026-04-13T09:00:00", "value": 1038.8 },
      { "id": "li15", "timestamp": "2026-04-13T12:00:00", "value": 1449.8 },
      { "id": "li16", "timestamp": "2026-04-13T15:00:00", "value": 1403.7 },
      { "id": "li17", "timestamp": "2026-04-13T18:00:00", "value": 827.8 },
      { "id": "li18", "timestamp": "2026-04-13T21:00:00", "value": 0 },
      { "id": "li19", "timestamp": "2026-04-14T00:00:00", "value": 0 },
      { "id": "li20", "timestamp": "2026-04-14T03:00:00", "value": 0 },
      { "id": "li21", "timestamp": "2026-04-14T06:00:00", "value": 392.4 },
      { "id": "li22", "timestamp": "2026-04-14T09:00:00", "value": 1069.0 },
      { "id": "li23", "timestamp": "2026-04-14T12:00:00", "value": 1499.7 },
      { "id": "li24", "timestamp": "2026-04-14T15:00:00", "value": 1359.9 },
      { "id": "li25", "timestamp": "2026-04-14T18:00:00", "value": 872.8 },
      { "id": "li26", "timestamp": "2026-04-14T21:00:00", "value": 0 },
      { "id": "li27", "timestamp": "2026-04-15T00:00:00", "value": 0 },
      { "id": "li28", "timestamp": "2026-04-15T03:00:00", "value": 0 },
      { "id": "li29", "timestamp": "2026-04-15T06:00:00", "value": 372.5 },
      { "id": "li30", "timestamp": "2026-04-15T09:00:00", "value": 1079.2 },
      { "id": "li31", "timestamp": "2026-04-15T12:00:00", "value": 1490.0 },
      { "id": "li32", "timestamp": "2026-04-15T15:00:00", "value": 1418.9 },
      { "id": "li33", "timestamp": "2026-04-15T18:00:00", "value": 817.5 },
      { "id": "li34", "timestamp": "2026-04-15T21:00:00", "value": 0 },
      { "id": "li35", "timestamp": "2026-04-16T00:00:00", "value": 0 },
      { "id": "li36", "timestamp": "2026-04-16T03:00:00", "value": 0 },
      { "id": "li37", "timestamp": "2026-04-16T06:00:00", "value": 401.7 },
      { "id": "li38", "timestamp": "2026-04-16T09:00:00", "value": 1044.2 },
      { "id": "li39", "timestamp": "2026-04-16T12:00:00", "value": 1502.6 },
      { "id": "li40", "timestamp": "2026-04-16T15:00:00", "value": 1390.2 },
      { "id": "li41", "timestamp": "2026-04-16T18:00:00", "value": 814.5 },
      { "id": "li42", "timestamp": "2026-04-16T21:00:00", "value": 0 },
      { "id": "li43", "timestamp": "2026-04-17T00:00:00", "value": 0 },
      { "id": "li44", "timestamp": "2026-04-17T03:00:00", "value": 0 },
      { "id": "li45", "timestamp": "2026-04-17T06:00:00", "value": 347.7 },
      { "id": "li46", "timestamp": "2026-04-17T09:00:00", "value": 1062.9 },
      { "id": "li47", "timestamp": "2026-04-17T12:00:00", "value": 1501.2 },
      { "id": "li48", "timestamp": "2026-04-17T15:00:00", "value": 1378.3 },
      { "id": "li49", "timestamp": "2026-04-17T18:00:00", "value": 868.1 },
      { "id": "li50", "timestamp": "2026-04-17T21:00:00", "value": 0 },
      { "id": "li51", "timestamp": "2026-04-18T00:00:00", "value": 0 },
      { "id": "li52", "timestamp": "2026-04-18T03:00:00", "value": 0 },
      { "id": "li53", "timestamp": "2026-04-18T06:00:00", "value": 411.2 },
      { "id": "li54", "timestamp": "2026-04-18T09:00:00", "value": 1095.7 },
      { "id": "li55", "timestamp": "2026-04-18T12:00:00", "value": 1472.6 },
      { "id": "li56", "timestamp": "2026-04-18T15:00:00", "value": 1362.3 },
      { "id": "li57", "timestamp": "2026-04-18T18:00:00", "value": 830.8 }
    ]
  }
];

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

// Unit keys match Settings/App state keys so default units can be generated automatically.
const SENSOR_TYPE_TO_UNIT_KEY = {
  temperature: 'temperatureUnit',
  air_humidity: 'humidityUnit',
  soil_moisture: 'soilMoistureUnit',
  light_intensity: 'lightIntensityUnit',
};

// Converts backend enum-like values (snake_case/kebab-case) into readable UI strings.
const toTitleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeModeValue = (value) => String(value || '').replace(/_/g, ' ').trim();

// Normalizes backend unit variations (Lux/lx) and applies fallback unit per sensor type.
const formatSensorUnit = (unit, sensorType) => {
  if (unit && typeof unit === 'string') {
    const normalized = unit.trim().toLowerCase();
    if (normalized === 'lux') return 'lux';
    if (normalized === 'lx') return 'lux';
    return unit;
  }
  return SENSOR_DEFAULT_UNIT[sensorType] || '';
};

const toDate = (timestamp) => new Date(timestamp);

const toTimeLabel = (timestamp) => {
  const date = toDate(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const toWeekdayLabel = (timestamp) => toDate(timestamp).toLocaleDateString('en-US', { weekday: 'short' });

const sortByTimestamp = (arr) => [...arr].sort((a, b) => toDate(a.timestamp) - toDate(b.timestamp));

const average = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const groupByDate = (data) => {
  const groups = {};
  data.forEach((point) => {
    const key = point.timestamp.slice(0, 10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(point);
  });
  return groups;
};

// Builds chart data for each range:
// - today: raw intraday points (no averaging)
// - threeDays/week: per-day average to keep wider ranges readable
const buildRangeSeries = (points) => {
  const sorted = sortByTimestamp(points || []);
  if (!sorted.length) {
    return {
      today: [],
      threeDays: [],
      week: [],
    };
  }

  const grouped = groupByDate(sorted);
  const dateKeys = Object.keys(grouped).sort();
  const latestDate = dateKeys[dateKeys.length - 1];
  const lastThreeDateKeys = dateKeys.slice(-3);
  const lastSevenDateKeys = dateKeys.slice(-7);

  const today = grouped[latestDate].map((point) => ({
    label: toTimeLabel(point.timestamp),
    value: point.value,
  }));

  const threeDays = lastThreeDateKeys.map((dateKey) => {
    const dayPoints = grouped[dateKey];
    const lastPoint = dayPoints[dayPoints.length - 1];
    return {
      label: toWeekdayLabel(lastPoint.timestamp),
      value: Number(average(dayPoints.map((point) => point.value)).toFixed(1)),
    };
  });

  const week = lastSevenDateKeys.map((dateKey) => {
    const dayPoints = grouped[dateKey];
    const lastPoint = dayPoints[dayPoints.length - 1];
    return {
      label: toWeekdayLabel(lastPoint.timestamp),
      value: Number(average(dayPoints.map((point) => point.value)).toFixed(1)),
    };
  });

  return { today, threeDays, week };
};

const normalizedSensorSeriesByType = Object.fromEntries(
  SENSOR_SERIES.map((entry) => [entry.sensor.type, buildRangeSeries(entry.data || [])])
);

// Shared chart range options used by chart dropdown and series selection.
export const CHART_RANGE_OPTIONS = [
  { key: 'today', label: 'today' },
  { key: 'threeDays', label: 'last 3 days' },
  { key: 'week', label: 'this week' },
];

// Main adapter output for sensor cards + AI context.
// Keeps raw payload available under "raw" for future backend debugging/migration.
export const DASHBOARD_SENSOR_OPTIONS = (FARM_INFO.sensors || []).map((sensor, index) => {
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

// Derives App/Settings default display units from backend sensor metadata.
export const DASHBOARD_DEFAULT_UNITS = (FARM_INFO.sensors || []).reduce(
  (acc, sensor) => {
    const unitKey = SENSOR_TYPE_TO_UNIT_KEY[sensor.type];
    if (!unitKey) return acc;

    return {
      ...acc,
      [unitKey]: formatSensorUnit(sensor.unit, sensor.type),
    };
  },
  {
    temperatureUnit: '°C',
    humidityUnit: '%',
    soilMoistureUnit: '%',
    lightIntensityUnit: 'lux',
  }
);

// Derives default crop/mode/stage values used to initialize shared app state.
export const DASHBOARD_CROP_DEFAULTS = {
  crop: toTitleCase(FARM_INFO.crop?.type),
  mode: normalizeModeValue(FARM_INFO.crop?.mode),
  growthStage: toTitleCase(FARM_INFO.crop?.growth_stage),
};

// Converts series keyed by backend type into series keyed by normalized UI sensor id.
export const DASHBOARD_SENSOR_SERIES = Object.fromEntries(
  DASHBOARD_SENSOR_OPTIONS.map((sensorOption) => {
    const sourceType = Object.keys(SENSOR_TYPE_TO_ID).find((key) => SENSOR_TYPE_TO_ID[key] === sensorOption.id);
    return [sensorOption.id, normalizedSensorSeriesByType[sourceType] || { today: [], threeDays: [], week: [] }];
  })
);

// Dashboard starts with first normalized sensor by default.
export const DEFAULT_SELECTED_SENSOR_ID = DASHBOARD_SENSOR_OPTIONS[0]?.id || 'temperature';

// Normalizes backend actuator naming/mode/schedule for carousel + control cards.
export const DASHBOARD_ACTUATORS = (FARM_INFO.actuators || []).map((actuator, index) => {
  const normalizedMode = actuator.control_mode === 'semi_auto' ? 'semi-auto' : 'auto';
  const name = actuator.type ? actuator.type.charAt(0).toUpperCase() + actuator.type.slice(1) : `Actuator ${index + 1}`;

  const schedule = actuator.run_at && actuator.run_until
    ? `${actuator.run_at.slice(11, 16)} - ${actuator.run_until.slice(11, 16)}`
    : actuator.run_at
      ? `Exec at ${actuator.run_at.slice(11, 16)}`
      : 'No schedule';

  return {
    id: actuator.id || `${actuator.type || 'actuator'}-${index}`,
    name,
    status: actuator.status || 'off',
    mode: normalizedMode,
    schedule,
    raw: actuator,
  };
});

// Raw warnings are exposed for alert rendering and AI context filtering.
export const DASHBOARD_WARNINGS = FARM_INFO.warnings || [];