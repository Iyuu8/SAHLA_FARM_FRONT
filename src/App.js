import { Routes, Route } from "react-router"
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
    languageOptions,
    temperatureOptions,
    humidityOptions,
    soilMoistureOptions,
    lightIntensityOptions,
  } = profileSettingOptions;

  // ── Farm settings — shared between Dashboard, Settings, and AIchat ──
  const [mode, setMode] = useState('balanced');
  const [manualControl, setManualControl] = useState('off');
  const [growthStage, setGrowthStage] = useState('Flowering');
  const [crop, setCrop] = useState('Tomatoes');

  // cropOptions lives in state so new crops added from either page persist everywhere
  const [cropOptions, setCropOptions] = useState(profileSettingOptions.cropOptions);

  const handleAddCropOption = (newCrop) => {
    setCropOptions((prev) => {
      const exists = prev.some((o) => o.toLowerCase() === newCrop.toLowerCase());
      return exists ? prev : [...prev, newCrop];
    });
  };

  const handleSetCrop = (newCrop) => {
    setCrop(newCrop);
    handleAddCropOption(newCrop);
  };

  // ── Display unit preferences — Settings only ──
  const [temperatureUnit, setTemperatureUnit] = useState('°C');
  const [humidityUnit, setHumidityUnit] = useState('%');
  const [soilMoistureUnit, setSoilMoistureUnit] = useState('%');
  const [lightIntensityUnit, setLightIntensityUnit] = useState('lux');
  const [language, setLanguage] = useState('English');

  // ── AI chat state — lifted here so the conversation survives page navigation ──
  const [chatMessages,  setChatMessages]  = useState([]);
  const [chatThinking,  setChatThinking]  = useState(false);
  const [chatMode,      setChatMode]      = useState('Detailed');

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout />}>

          <Route
            index
            element={
              <Dashboard
                crop={crop}
                setCrop={handleSetCrop}
                cropOptions={cropOptions}
                onAddCropOption={handleAddCropOption}
                growthStage={growthStage}
                setGrowthStage={setGrowthStage}
                mode={mode}
                setMode={setMode}
              />
            }
          />

          <Route path="/history" element={<History />} />
          <Route path="/stream" element={<CamStream />} />

          <Route
            path="/chat"
            element={
              <AIchat
                // Farm context — stays in sync with Dashboard & Settings
                crop={crop}
                growthStage={growthStage}
                mode={mode}
                // Lifted conversation state — persists across navigation
                messages={chatMessages}
                setMessages={setChatMessages}
                isThinking={chatThinking}
                setIsThinking={setChatThinking}
                responseMode={chatMode}
                setResponseMode={setChatMode}
              />
            }
          />

          <Route path="/notifications" element={<Notifications />} />

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
                setCrop={handleSetCrop}
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