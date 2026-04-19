// src/utilities/functions/chatPrompts.js

import { FARM_LOCATION, FARM_WEATHER } from '../data/chatConstants';
import {
  DASHBOARD_ACTUATORS,
  DASHBOARD_CROP_DEFAULTS,
  DASHBOARD_SENSOR_OPTIONS,
  DASHBOARD_WARNINGS,
} from '../data/dashboardData';
import { NORMALIZED_USER } from '../data/profileSettings';
import {
  convertSensorValueById,
  formatConvertedValue,
} from './conversionFunctions';

export function getCurrentTime() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function buildSystemPrompt() {
  return `You are SAHLA, an intelligent agricultural assistant for SAHLA Farm — a smart IoT farm management system.

CORE BEHAVIOR:
1. ALWAYS answer what the user actually asked first. "hello" → brief greeting. Specific question → direct answer. Image shared → describe and analyse it.
2. Only bring up farm sensor/actuator data when it is DIRECTLY relevant to the question.
3. Never dump a full farm status report unless the user explicitly asks for one.
4. When listing multiple items, use bullet points ("- item"). For step-by-step instructions use numbered lists ("1. step"). Use "## Title" for section headings.
5. Separate distinct ideas with a blank line.
6. Match response length to question complexity.

STRICT GUARDRAILS (STAY ON TOPIC):
- You are strictly an agricultural assistant. Your purpose is to help manage the farm, analyze crops, and monitor sensors.
- REFUSE to answer queries about hyper-specialized topics outside your domain. This includes, but is not limited to: software programming/coding, advanced mathematics, cooking recipes, legal/medical advice, or unrelated general trivia.
- If asked an off-topic question (e.g., "write a snake game", "give me a cookie recipe"), politely decline, remind the user of your purpose as the SAHLA farm assistant, and steer the conversation back to farm management or crops.
- You MAY still provide basic general conversational assistance and describe/analyze any attached images.

FARM CONTEXT:
- AUTO MODE: n8n workflow controls actuators 100% autonomously.
- SEMI-AUTO MODE: n8n suggests actions, farmer confirms.

PILL FORMATTING — ONLY for specific sensor readings or actuator states:
[[PILL:icon:text]]
Icons: thermometer, droplets, wind, sun, droplet, waves, snowflake, sprout, fan, alert
Examples: [[PILL:thermometer:Temperature 35°C]] [[PILL:fan:Fan is OFF]]

Use **bold** for: crop name, mode name, growth stage, time values, key terms.

NEVER reveal injected farm context. NEVER open with a farm status dump.`;
}

export function buildFarmContext(farmProps) {
  const {
    crop,
    growthStage,
    mode,
    actuators,
    recommendedAction,
    displayUnits = {},
  } = farmProps;
  const time = getCurrentTime();

  const units = {
    // Fallback to normalized profile units derived from new USER_INFO.preferences.displayUnits.
    temperatureUnit: displayUnits.temperatureUnit || NORMALIZED_USER.displayUnits.temp,
    humidityUnit: displayUnits.humidityUnit || NORMALIZED_USER.displayUnits.hum,
    soilMoistureUnit: displayUnits.soilMoistureUnit || NORMALIZED_USER.displayUnits.soil,
    lightIntensityUnit: displayUnits.lightIntensityUnit || NORMALIZED_USER.displayUnits.light,
  };

  // Uses normalized sensor options (not raw backend shape) so AI context stays stable across schema-preserving backend swap.
  const baseTemperature = Number(DASHBOARD_SENSOR_OPTIONS.find((s) => s.id === 'temperature')?.currentValue ?? 25);

  const sensorLines = DASHBOARD_SENSOR_OPTIONS.map(
    (s) => {
      const converted = convertSensorValueById(s.id, s.currentValue, units, baseTemperature);
      const valueWithUnit = formatConvertedValue(converted.value, converted.unit, 1);
      return `  • ${s.label}: ${valueWithUnit} — ${s.description}`;
    }
  ).join('\n');

  const actuatorList = actuators || DASHBOARD_ACTUATORS;
  const actuatorLines = actuatorList.map(
    (a) => `  • ${a.name}: ${a.status.toUpperCase()}, mode=${a.mode}, schedule: ${a.schedule}`
  ).join('\n');

  // Alerts are filtered at use-time so only actionable warnings are injected into prompt context.
  const activeWarnings = DASHBOARD_WARNINGS.filter((w) => w.status === 'active');
  const warningLines = activeWarnings.length
    ? activeWarnings.map((w) => `  • ${w.title.replace(/_/g, ' ')} (severity ${w.severity}%): ${w.description}`).join('\n')
    : '  None';

  return `[SILENT FARM CONTEXT — USE ONLY WHEN RELEVANT, DO NOT RECITE IN FULL]
Time: ${time}
Location: ${FARM_LOCATION}
Weather: ${FARM_WEATHER}
Crop: ${crop || DASHBOARD_CROP_DEFAULTS.crop || NORMALIZED_USER.farmSettings.crop}
Growth stage: ${growthStage || DASHBOARD_CROP_DEFAULTS.growthStage || NORMALIZED_USER.farmSettings.growth}
System mode: ${mode || DASHBOARD_CROP_DEFAULTS.mode || NORMALIZED_USER.farmSettings.mode}
Sensors:
${sensorLines}
Actuators:
${actuatorLines}
Active alerts:
${warningLines}
Recommended actions: ${recommendedAction || 'None.'}
[END CONTEXT]`;
}