import { SunnyIcon, ClearNightIcon, CloudyIcon, HeavyRainIcon, HeavyRainAltIcon, WindyIcon } from './Icons';

const weathers = [
  { type: "sunny",  icon: SunnyIcon,        temp: "28°C", hum: "45%" },
  { type: "cloudy", icon: CloudyIcon,        temp: "21°C", hum: "65%" },
  { type: "rainy",  icon: HeavyRainAltIcon,  temp: "18°C", hum: "85%" },
  { type: "stormy", icon: HeavyRainIcon,     temp: "17°C", hum: "90%" },
  { type: "windy",  icon: WindyIcon,         temp: "22°C", hum: "50%" },
  { type: "night",  icon: ClearNightIcon,    temp: "15°C", hum: "55%" },
];

const crops = ["tomato", "wheat", "corn", "orange", "olive", "potato", "cucumber", "pepper"];

const stages = ["seedling", "vegetative", "flowering", "fruiting", "harvesting", "germination"];

// generates dates from 01-01-26 to 28-02-26
const generateDates = () => {
  const dates = [];
  for (let month = 1; month <= 2; month++) {
    const days = month === 1 ? 31 : 28;
    for (let day = 1; day <= days; day++) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      dates.push(`${dd}-${mm}-26`);
    }
  }
  return dates;
};

// generates times from 00:00 to 23:00
const generateTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
  }
  return times;
};

const allDates = generateDates(); // 59 dates
const allTimes = generateTimes(); // 24 times

const weatherSummaries = {
  sunny:  "Clear skies and high temperatures detected. Evaporation rate is elevated — <b>soil dries faster than usual.</b> Photosynthesis is at peak efficiency but <b>heat stress is a risk</b> for sensitive crops.",
  cloudy: "Overcast conditions with moderate temperatures. <b>Light diffusion is optimal</b> for most crops. Low evaporation — <b>reduce irrigation</b> if soil moisture is adequate.",
  rainy:  "Rainfall detected across the field. <b>Soil moisture is elevated</b> — pause irrigation immediately. Monitor for <b>waterlogging and fungal disease</b> risks.",
  stormy: "Severe storm conditions recorded. <b>High wind and heavy rain</b> may cause crop damage. Inspect field infrastructure and <b>drainage systems</b> after the storm.",
  windy:  "Strong winds present. Natural airflow may <b>reduce humidity</b> around crops. Risk of <b>mechanical damage</b> to tall or fragile plants — consider support structures.",
  night:  "Clear night conditions. Temperatures are dropping — monitor for <b>frost risk</b> if below 4°C. Overnight <b>dew formation</b> may slightly raise surface moisture.",
};

const aiRecommendations = [
  "Maintain <b>current irrigation schedule</b> and monitor soil moisture closely.",
  "Check <b>nutrient levels</b> and adjust fertilization schedule accordingly.",
  "Consider applying <b>fungicide treatment</b> given the current humidity levels.",
  "Inspect crops for <b>pest activity</b> — conditions are favorable for infestation.",
  "Reduce irrigation frequency — <b>soil moisture is currently sufficient.</b>",
  "Activate <b>frost protection</b> systems tonight based on temperature forecast.",
  "Increase ventilation in greenhouse zones to <b>prevent heat stress.</b>",
  "Schedule a <b>soil pH test</b> — optimal range for current crop is 6.0–6.8.",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const HistoryData = Array.from({ length: 200 }, (_, i) => {
  const randomWeather = rand(weathers);
  const randomStage   = rand(stages);
  const randomDate    = rand(allDates);
  const randomTime    = rand(allTimes);
  const randomCrop    = rand(crops);

  const pumpOn   = Math.random() > 0.5;
  const fanOn    = Math.random() > 0.5;
  const hasTimer = pumpOn && Math.random() > 0.4;

  const executeFrom  = hasTimer ? `${String(Math.floor(Math.random() * 12) + 6).padStart(2, "0")}:00` : null;
  const executeUntil = hasTimer ? `${String(parseInt(executeFrom) + 1).padStart(2, "0")}:30`           : null;

  return {
    id:          i + 1,
    date:        randomDate,
    time:        randomTime,
    crop:        randomCrop,
    growthStage: randomStage,
    weather:     randomWeather.type,
    weatherIcon: randomWeather.icon,
    details: {
      date:        randomDate,
      time:        randomTime,
      crop:        randomCrop.charAt(0).toUpperCase() + randomCrop.slice(1),
      growthStage: randomStage,
      weatherIcon: randomWeather.icon,
      sensors: {
        temperature:    randomWeather.temp,
        humidity:       randomWeather.hum,
        soilMoisture:   `${Math.floor(Math.random() * 60) + 20}%`,
        lightIntensity: `${Math.floor(Math.random() * 80000) + 1000}lx`,
      },
      actuators: [
        {
          name:           "pump",
          physical_state: pumpOn ? "on" : "off",
          control_mode:   rand(["auto", "semi-auto", "manual"]),
          timer: {
            active:           hasTimer,
            duration_minutes: hasTimer ? Math.floor(Math.random() * 45) + 10 : null,
            execute_from:     executeFrom,
            execute_until:    executeUntil,
          },
          delay: { active: false, execute_at: null },
        },
        {
          name:           "fan",
          physical_state: fanOn ? "on" : "off",
          control_mode:   rand(["auto", "semi-auto"]),
          timer: {
            active:           false,
            duration_minutes: null,
            execute_from:     null,
            execute_until:    null,
          },
          delay: { active: false, execute_at: null },
        },
      ],
      weatherSummary:   weatherSummaries[randomWeather.type],
      aiRecommendation: rand(aiRecommendations),
    },
  };
});

export default HistoryData;