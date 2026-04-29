import { Routes, Route } from "react-router";
import { useState } from "react";
import Dashboard from "./pages/dashboard.jsx";
import AIchat from "./pages/aiChat.jsx";
import History from "./pages/history.jsx";
import CamStream from "./pages/camStream.jsx";
import Login from "./auth/login.jsx";
import SignUp from "./auth/signup.jsx";
import Settings from "./pages/settings.jsx";
import Notifications from "./pages/notifications.jsx";
import Layout from "./layout.jsx";
import NotFound from "./pages/notFound.jsx";
import HACredentialsRequired from "./pages/haCredentialsRequired.jsx";
import useFarmPreferences from "./hooks/useFarmPreferences";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import { useHaConfiguration } from "./context/HaContext.jsx";


function App() {
  // Temporary frontend flag until backend controls HA credentials onboarding state.
  const { isHAConfigured, configurationError } = useHaConfiguration();

  // App is intentionally thin: pages read/write shared state through storage-backed hooks.
  // History remains prop-driven, so we expose current unit preferences here.
  const {
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  const blockedPage = <HACredentialsRequired configurationError={configurationError} />;

  const protectedElement = (element) =>
    isHAConfigured ? element : blockedPage;

  return (
    <>
      <Routes>
        {/* Public routes — no auth needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes — ProtectedRoute checks Supabase session */}
        <Route element={<ProtectedRoute/>}>
       
          <Route path="/" element={<Layout />}>
            <Route index element={isHAConfigured ? <Dashboard /> : blockedPage} />

            <Route
              path="/dashboard"
              element={isHAConfigured ? <Dashboard /> : blockedPage}
            />

            <Route
              path="/history"
              element={isHAConfigured || configurationError?.status === "haDown" ? (
                <History
                  temperatureUnit={temperatureUnit}
                  humidityUnit={humidityUnit}
                  soilMoistureUnit={soilMoistureUnit}
                  lightIntensityUnit={lightIntensityUnit}
                />
              ) : blockedPage}
            />
            <Route path="/stream" element={isHAConfigured ? <CamStream /> : blockedPage} />

            <Route path="/chat" element={isHAConfigured  || configurationError?.status === "haDown"  ? <AIchat /> : blockedPage} />

            <Route
              path="/notifications"
              element={isHAConfigured || configurationError?.status === "haDown"  ? <Notifications /> : blockedPage}
            />

            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
