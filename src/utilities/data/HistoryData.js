import { SunnyIcon, ClearNightIcon, CloudyIcon, HeavyRainIcon, HeavyRainAltIcon, WindyIcon } from './Icons';

const weathers = [
  { type: "sunny",  icon: SunnyIcon,        temp: "28°C", hum: "45%" },
  { type: "cloudy", icon: CloudyIcon,        temp: "21°C", hum: "65%" },
  { type: "rainy",  icon: HeavyRainAltIcon,  temp: "18°C", hum: "85%" },
  { type: "stormy", icon: HeavyRainIcon,     temp: "17°C", hum: "90%" },
  { type: "windy",  icon: WindyIcon,         temp: "22°C", hum: "50%" },
  { type: "night",  icon: ClearNightIcon,    temp: "15°C", hum: "55%" },
];

const crops = ["tomatoes", "lettuce", "cucumber", "strawberries", "basil", "spinach", "peppers"];

const stages = ["germination", "seedling", "vegetative growth", "flowering", "fruiting", "maturity"];

// generates dates from 01-01-26 to current date
const generateDates = () => {
  const dates = [];
  const startDate = new Date(2026, 0, 1); // January 1, 2026
  const endDate = new Date(); // Today
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).slice(-2);
    dates.push(`${day}-${month}-${year}`);
    currentDate.setDate(currentDate.getDate() + 1);
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

// Helper function to generate random date between start and end
const getRandomDate = (dates) => rand(dates);

// Helper function to generate random ISO datetime
const getRandomDateTime = (date, time) => {
  const [day, month, year] = date.split('-');
  const [hours] = time.split(':');
  const fullYear = 2000 + parseInt(year);
  const randomMinutes = Math.floor(Math.random() * 60);
  return new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hours), randomMinutes).toISOString();
};

const HistoryData = Array.from({ length: 200 }, (_, i) => {
  const randomWeather = rand(weathers);
  const randomStage = rand(stages);
  const randomDate = getRandomDate(allDates);
  const randomTime = rand(allTimes);
  const randomCrop = rand(crops);

  // Random states for actuators
  const pumpStatus = Math.random() > 0.5 ? "on" : "off";
  const fanStatus = Math.random() > 0.5 ? "on" : "off";
  const pumpHasSchedule = pumpStatus === "on" && Math.random() > 0.4;
  const fanHasSchedule = fanStatus === "on" && Math.random() > 0.5;

  // Generate random datetime for actuators
  const pumpDateTime = pumpHasSchedule ? getRandomDateTime(randomDate, randomTime) : null;
  const fanDateTime = fanHasSchedule ? getRandomDateTime(randomDate, randomTime) : null;
  
  // Calculate run_until based on duration
  const pumpDuration = pumpHasSchedule ? Math.floor(Math.random() * 45) + 10 : null;
  const fanDuration = fanHasSchedule ? Math.floor(Math.random() * 30) + 15 : null;
  
  const pumpRunUntil = pumpDateTime && pumpDuration ? new Date(new Date(pumpDateTime).getTime() + pumpDuration * 60000).toISOString() : null;
  const fanRunUntil = fanDateTime && fanDuration ? new Date(new Date(fanDateTime).getTime() + fanDuration * 60000).toISOString() : null;
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
      temperature: randomWeather.temp,
      humidity: randomWeather.hum,
      soilMoisture: `${Math.floor(Math.random() * 60) + 20}%`,
      lightIntensity: `${Math.floor(Math.random() * 80000) + 1000}lx`,
    },
    actuators: [
      {
        id: `pump_${i + 1}`,
        type: "pump",
        status: pumpStatus,
        control_mode: pumpStatus === "on" ? rand(["auto", "semi_auto"]) : "auto",
        run_at: pumpDateTime,
        duration_minutes: pumpDuration,
        run_until: pumpRunUntil
      },
      {
        id: `fan_${i + 1}`,
        type: "fan",
        status: fanStatus,
        control_mode: fanStatus === "on" ? rand(["auto", "semi_auto"]) : "auto",
        run_at: fanDateTime,
        duration_minutes: fanDuration,
        run_until: fanRunUntil
      }
    ],
      weatherSummary:   weatherSummaries[randomWeather.type],
      aiRecommendation: rand(aiRecommendations),
    },
  };
});

export default HistoryData;