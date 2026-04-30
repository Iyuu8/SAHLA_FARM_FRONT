import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../supabaseClient";
import { useHaConfiguration } from "../context/HaContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import Spinner from "../utilities/components/loading/Spinner.jsx";

export default function ProtectedRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isConnected } = useSocket();

  const { setIsHAConfigured, setConfigurationError } = useHaConfiguration();

  useEffect(() => {
    console.log("Checking authentication and Home Assistant configuration...");
    const checkAuthAndHA = async () => {
      try {
        // 1. Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (!session) {
          setLoading(false);
          return;
        }

        // 2. Verify home assistant configuration with backend
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        // 3. If backend says NO → HA not configured
        if (!response.ok) {
          const errorData = await response.json();
          setIsHAConfigured(false);
          setConfigurationError({ status: errorData.status, message: errorData.message });
          setLoading(false);
          return;
        }

        // 4. Backend OK → HA configured
        setConfigurationError(null);
        setIsHAConfigured(true);
      } catch (err) {
        console.error("Auth/HA check failed:", err);
        setConfigurationError({ status: 'backendDown', message: 'An unexpected error occurred while verifying authentication and Home Assistant configuration.' });
        setIsHAConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndHA();
  }, [isConnected]);

  // 1. loading state
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size={80}/>
      </div>
    );
  }

  // 2. not logged in → login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 4. everything OK
  return <Outlet />;
}
