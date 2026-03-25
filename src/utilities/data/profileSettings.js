export const user = {
    pfp : "https://images5.alphacoders.com/100/1005348.jpg",
    userName: "ayoub",
    email: "anesbenaziza19@gmail.com",
    address: "Sidi Bel Abbes, Algeria",
    age: 24,
    password: "123456",
    homeAssistantId: "http://sahla-homeassistant.local:8123Bearer123456789",
    displayUnits:{
        temp: "°C",
        hum: "%",
        soil: "%",
        light: "lux",
        language: "English",
    },
    farmSettings:{
        mode : "balanced",
        manualControl:"off",
        growth: "flowering",
        crop: "tomatoes"
    }

}

export const profileSettingOptions = {
    modeOptions: ['balanced', 'water saving', 'energy saving', 'growth priority'],
    manualControlOptions: ['on', 'off'],
    growthStageOptions: ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting', 'Maturity'],
    cropOptions: ['Tomatoes', 'Lettuce', 'Cucumber', 'Strawberries', 'Basil', 'Spinach', 'Peppers'],
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