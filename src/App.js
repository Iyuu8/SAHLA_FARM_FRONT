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
import ProtectedRoute from "./pages/ProtectedRoute .jsx";
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import { useHAStatus, INVALID_STATUSES } from "./context/HAStatusContext";


function App() {
  // Temporary frontend flag until backend controls HA credentials onboarding state.
  const { haStatus, haLoading } = useHAStatus();

  // App is intentionally thin: pages read/write shared state through storage-backed hooks.
  // History remains prop-driven, so we expose current unit preferences here.
  const {
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  const protectedElement = (element) =>{
    if (haLoading) return null;
    if (INVALID_STATUSES.includes(haStatus)) return <HACredentialsRequired />;
    return element;
  }
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
            <Route index element={protectedElement(<Dashboard />)} />

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
                />,
              )}
            />
            <Route path="/stream" element={protectedElement(<CamStream />)} />

            <Route path="/chat" element={protectedElement(<AIchat />)} />

            <Route
              path="/notifications"
              element={protectedElement(<Notifications />)}
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
