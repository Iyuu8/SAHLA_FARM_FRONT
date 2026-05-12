import { Routes, Route, Outlet } from "react-router";
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
import ProtectedRoute from "./pages/ProtectedRoute .jsx";
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import LandingPage from "./pages/LandingPage.jsx";
import HelpPage from "./pages/Helppage.jsx";
import { FarmProvider } from "./context/FarmContext.jsx";
import { ActuatorProvider } from "./context/ActuatorContext.jsx";
import { HAStatusProvider, useHAStatus, INVALID_STATUSES } from "./context/HAStatusContext";

const HARequiredLayout = () => {
  const { haStatus, haLoading } = useHAStatus();

  if (haLoading) return null; 
  if (INVALID_STATUSES.includes(haStatus)) return <HACredentialsRequired />;
  
  return <Outlet />; 
};

function App() {
  return (
    <>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/help" element={<HelpPage />} />
        
        {/* --- PROTECTED ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          
          <Route element={
            <HAStatusProvider>
              <FarmProvider>
                  <ActuatorProvider>
                  <Layout />
                  </ActuatorProvider>
              </FarmProvider>
            </HAStatusProvider>
          }>
            
            {/* --- GROUP A: Strict Routes --- */}
            <Route element={<HARequiredLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              <Route path="history" element={<History />} />
              
              <Route path="stream" element={<CamStream />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* --- GROUP B: Flexible Routes --- */}
            <Route path="chat" element={<AIchat />} />
            <Route path="settings" element={<Settings />} />

          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;