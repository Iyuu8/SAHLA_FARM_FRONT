import {SunnyIcon,ClearNightIcon,CloudyIcon,HeavyRainIcon,HeavyRainAltIcon,WindyIcon} from './Icons'
const HistoryData = Array.from({ length: 50 }, (_, i) => {
  const dates = ["13-02-26", "12-02-26", "11-02-26", "10-02-26", "09-02-26"];
  const stages = ["seedling", "vegetative", "flowering", "fruiting", "harvesting"];
  const weathers = [
    { type: "sunny", icon: SunnyIcon , temp: "28°C", hum: "45%" },
    { type: "cloudy", icon: CloudyIcon, temp: "21°C", hum: "65%" },
    { type: "rainy", icon: HeavyRainAltIcon, temp: "18°C", hum: "85%" },
    { type: "stormy", icon: HeavyRainIcon, temp: "17°C", hum: "90%" },
    { type: "windy", icon: WindyIcon, temp: "22°C", hum: "50%" }
  ];

  const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
  const randomStage = stages[Math.floor(Math.random() * stages.length)];
  const randomDate = dates[Math.floor(Math.random() * dates.length)];
  
  return {
    id: i + 1,
    date: randomDate,
    time: `${10 + (i % 12)}:00`,
    crop: "tomato",
    growthStage: randomStage,
    weather: randomWeather.type,
    weatherIcon: randomWeather.icon,
    hasBadge: i === 1, // Mimicking the "B" badge from your image on the 2nd row
    details: {
      temperature: randomWeather.temp,
      soilMoisture: `${60 + (i % 20)}%`,
      light: `${1000 + (i * 200)} lux`,
      humidity: randomWeather.hum,
      fan: {
        state: i % 3 === 0 ? "on" : "off",
        mode: "auto"
      },
      weatherSummary: `Conditions are ${randomWeather.type} for the ${randomStage} stage.`,
      recommendations: i % 5 === 0 ? "Check nutrient levels." : "Maintain current schedule."
    }
  };
});

export default HistoryData;