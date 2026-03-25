import {Routes, Route} from "react-router"
import { useState } from 'react'
import Dashboard from "./pages/dashboard.jsx"
import AIchat from "./pages/aiChat.jsx"
import History from "./pages/history.jsx"
import CamStream from "./pages/camStream.jsx"
import Login from "./auth/login.jsx"
import SignUp from "./auth/signup.jsx"
import Settings from "./pages/settings.jsx"
import Notifications from "./pages/notifications.jsx"
import Layout from "./layout.jsx"
import { profileSettingOptions } from "./utilities/data/profileSettings"
function App() {
  const {
    modeOptions,
    manualControlOptions,
    growthStageOptions,
    cropOptions,
    languageOptions,
    temperatureOptions,
    humidityOptions,
    soilMoistureOptions,
    lightIntensityOptions,
  } = profileSettingOptions;

  const [mode, setMode] = useState('balanced');
  const [manualControl, setManualControl] = useState('off');
  const [growthStage, setGrowthStage] = useState('Flowering');
  const [crop, setCrop] = useState('Tomatoes');

  const [temperatureUnit, setTemperatureUnit] = useState('°C');
  const [humidityUnit, setHumidityUnit] = useState('%');
  const [soilMoistureUnit, setSoilMoistureUnit] = useState('%');
  const [lightIntensityUnit, setLightIntensityUnit] = useState('lux');
  const [language, setLanguage] = useState('English');

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />

        <Route path="/" element={<Layout/>}>

          <Route index element={<Dashboard/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/stream" element={<CamStream/>} />
          <Route path="/chat" element={<AIchat/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route
            path="/settings"
            element={
              <Settings
                mode={mode}
                setMode={setMode}
                modeOptions={modeOptions}
                manualControl={manualControl}
                setManualControl={setManualControl}
                manualControlOptions={manualControlOptions}
                growthStage={growthStage}
                setGrowthStage={setGrowthStage}
                growthStageOptions={growthStageOptions}
                crop={crop}
                setCrop={setCrop}
                cropOptions={cropOptions}
                temperatureUnit={temperatureUnit}
                setTemperatureUnit={setTemperatureUnit}
                temperatureOptions={temperatureOptions}
                humidityUnit={humidityUnit}
                setHumidityUnit={setHumidityUnit}
                humidityOptions={humidityOptions}
                soilMoistureUnit={soilMoistureUnit}
                setSoilMoistureUnit={setSoilMoistureUnit}
                soilMoistureOptions={soilMoistureOptions}
                lightIntensityUnit={lightIntensityUnit}
                setLightIntensityUnit={setLightIntensityUnit}
                lightIntensityOptions={lightIntensityOptions}
                language={language}
                setLanguage={setLanguage}
                languageOptions={languageOptions}
              />
            }
          />

        </Route>

      </Routes>
    </>
  );
}

export default App