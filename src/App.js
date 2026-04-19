import { Routes, Route } from "react-router"
import Dashboard from "./pages/dashboard.jsx"
import AIchat from "./pages/aiChat.jsx"
import History from "./pages/history.jsx"
import CamStream from "./pages/camStream.jsx"
import Login from "./auth/login.jsx"
import SignUp from "./auth/signup.jsx"
import Settings from "./pages/settings.jsx"
import Notifications from "./pages/notifications.jsx"
import Layout from "./layout.jsx"
import useFarmPreferences from './hooks/useFarmPreferences'

function App() {
  // App is intentionally thin: pages read/write shared state through storage-backed hooks.
  // History remains prop-driven, so we expose current unit preferences here.
  const {
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="/history"
            element={
              <History
                temperatureUnit={temperatureUnit}
                humidityUnit={humidityUnit}
                soilMoistureUnit={soilMoistureUnit}
                lightIntensityUnit={lightIntensityUnit}
              />
            }
          />
          <Route path="/stream" element={<CamStream />} />

          <Route path="/chat" element={<AIchat />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>
    </>
  );
}

export default App