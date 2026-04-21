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
import NotFound from './pages/notFound.jsx'
import HACredentialsRequired from './pages/haCredentialsRequired.jsx'
import useFarmPreferences from './hooks/useFarmPreferences'

function App() {
  // Temporary frontend flag until backend controls HA credentials onboarding state.
  const [isHAConfigured] = useState(true);

  // App is intentionally thin: pages read/write shared state through storage-backed hooks.
  // History remains prop-driven, so we expose current unit preferences here.
  const {
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  const blockedPage = <HACredentialsRequired />;

  const protectedElement = (element) => (isHAConfigured ? element : blockedPage);

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout />}>

          <Route
            index
            element={protectedElement(<Dashboard />)}
          />

          <Route
            path="/dashboard"
            element={protectedElement(<Dashboard />)}
          />

          <Route
            path="/history"
            element={protectedElement(
              <History
                temperatureUnit={temperatureUnit}
                humidityUnit={humidityUnit}
                soilMoistureUnit={soilMoistureUnit}
                lightIntensityUnit={lightIntensityUnit}
              />
            )}
          />
          <Route path="/stream" element={protectedElement(<CamStream />)} />

          <Route path="/chat" element={protectedElement(<AIchat />)} />

          <Route path="/notifications" element={protectedElement(<Notifications />)} />

          <Route path="/settings" element={<Settings />} />

        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App