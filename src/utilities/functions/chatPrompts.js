// src/utilities/functions/chatPrompts.js

import { FARM_LOCATION, FARM_WEATHER } from "../data/chatConstants";
import {
  DASHBOARD_ACTUATORS,
  DASHBOARD_CROP_DEFAULTS,
  DASHBOARD_SENSOR_OPTIONS,
  DASHBOARD_WARNINGS,
} from "../data/dashboardData";
import { NORMALIZED_USER } from "../data/profileSettings";
import {
  convertSensorValueById,
  formatConvertedValue,
} from "./conversionFunctions";

export function getCurrentTime() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Prompt 3: Strip region suffix so 'ar-DZ' → 'ar', 'fr-FR' → 'fr' ────────
export function normalizeLanguage(lang) {
  if (!lang) return "en";
  return lang.split("-")[0].toLowerCase();
}

// ─── Language instruction injected at the TOP of every prompt ─────────────────
export function buildLanguageInstruction(lang) {
  const normalized = normalizeLanguage(lang);
  return `[LANGUAGE DIRECTIVE — HIGHEST PRIORITY]: Your ENTIRE response MUST be written in the language with ISO code '${normalized}'. Translate ALL text including headers, sensor names, labels, and introductory phrases. Do NOT use English except for technical units like °C, %, lux, and proper nouns (e.g. "SAHLA").`;
}

export function buildSystemPrompt(lang) {
  const languageInstruction = buildLanguageInstruction(lang);

  return `${languageInstruction}

You are SAHLA, an intelligent agricultural assistant for SAHLA Farm — a smart IoT farm management system.

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
    sensors,
    warnings,
    recommendedAction,
    displayUnits = {},
  } = farmProps;
  
  const time = getCurrentTime();
  const units = {
    temperatureUnit:
      displayUnits.temperatureUnit || NORMALIZED_USER.displayUnits.temp,
    humidityUnit: displayUnits.humidityUnit || NORMALIZED_USER.displayUnits.hum,
    soilMoistureUnit:
      displayUnits.soilMoistureUnit || NORMALIZED_USER.displayUnits.soil,
    lightIntensityUnit:
      displayUnits.lightIntensityUnit || NORMALIZED_USER.displayUnits.light,
  };

  const tempSensor = (sensors || []).find((s) => s.type === "temperature");
  const baseTemperature = tempSensor?.value ?? 25;

  let sensorLines = "";
  if (sensors && sensors.length) {
    sensorLines = sensors
      .map((s) => {
        const converted = convertSensorValueById(
          s.type,
          s.value,
          units,
          baseTemperature,
        );
        const valueWithUnit = formatConvertedValue(
          converted.value,
          converted.unit,
          1,
        );
        const label =
          s.type.charAt(0).toUpperCase() +
          s.type.slice(1).replace(/([A-Z])/g, " $1");
        return `  • ${label}: ${valueWithUnit} — ${s.description || "No description"}`;
      })
      .join("\n");
  } else {
    sensorLines = DASHBOARD_SENSOR_OPTIONS.map((s) => {
      const converted = convertSensorValueById(
        s.id,
        s.currentValue,
        units,
        baseTemperature,
      );
      const valueWithUnit = formatConvertedValue(
        converted.value,
        converted.unit,
        1,
      );
      return `  • ${s.label}: ${valueWithUnit} — ${s.description}`;
    }).join("\n");
  }

  let actuatorLines = "";
  if (actuators && actuators.length) {
    actuatorLines = actuators
      .map((a) => {
        const status = a.status?.toUpperCase() || "OFF";
        const modeVal =
          a.control_mode === "semi_auto"
            ? "semi-auto"
            : a.control_mode || "auto";
        const schedule =
          a.run_at && a.run_until
            ? `${a.run_at.slice(11, 16)} → ${a.run_until.slice(11, 16)}`
            : a.run_at
              ? `Exec at ${a.run_at.slice(11, 16)}`
              : "No schedule";
        const name =
          a.type === "pump" ? "Pump" : a.type === "fan" ? "Fan" : a.type;
        return `  • ${name}: ${status}, mode=${modeVal}, schedule: ${schedule}`;
      })
      .join("\n");
  } else {
    const fallbackActuators = [
      { name: "Pump", status: "OFF", mode: "auto", schedule: "No schedule" },
      { name: "Fan", status: "OFF", mode: "auto", schedule: "No schedule" },
    ];
    actuatorLines = fallbackActuators
      .map(
        (a) =>
          `  • ${a.name}: ${a.status}, mode=${a.mode}, schedule: ${a.schedule}`,
      )
      .join("\n");
  }

  let warningLines = "";
  if (warnings && warnings.length) {
    warningLines = warnings
      .map((w) => {
        const severity = w.severity ?? 0;
        return `  • ${w.title.replace(/_/g, " ")} (severity ${severity}%): ${w.description || "No description"}`;
      })
      .join("\n");
  } else {
    warningLines = "  None";
  }

  const cropName =
    crop || DASHBOARD_CROP_DEFAULTS.crop || NORMALIZED_USER.farmSettings.crop;
  const cropStage =
    growthStage ||
    DASHBOARD_CROP_DEFAULTS.growthStage ||
    NORMALIZED_USER.farmSettings.growth;
  const systemMode =
    mode || DASHBOARD_CROP_DEFAULTS.mode || NORMALIZED_USER.farmSettings.mode;
  const recAction = recommendedAction || "None.";

  return `[SILENT FARM CONTEXT — USE ONLY WHEN RELEVANT, DO NOT RECITE IN FULL]
Time: ${time}
Location: ${FARM_LOCATION}
Weather: ${FARM_WEATHER}
Crop: ${cropName}
Growth stage: ${cropStage}
System mode: ${systemMode}
Sensors:
${sensorLines}
Actuators:
${actuatorLines}
Active alerts:
${warningLines}
Recommended actions: ${recommendedAction || "None."}
[END CONTEXT]`;
}
