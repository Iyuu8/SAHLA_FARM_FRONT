import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// Set your API Base URL (adjust for production)
const API_BASE = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/settings`;

export default function useHaCredentials() {
  const [haUrl, setHaUrl] = useState(null);
  const [haToken, setHaToken] = useState(null);
  const [isHaOnline, setIsHaOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("API Base URL:", API_BASE);
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/ha-credentials`, {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
        });

        const json = await res.json();

        if (res.ok) {
          
          // Only set online to true if we actually received a URL and a Token
          if (json.haUrl && json.haToken) {
            const cleanUrl = json.haUrl.endsWith('/') ? json.haUrl.slice(0, -1) : json.haUrl;
            setHaUrl(cleanUrl);
            setHaToken(json.haToken);
            setIsHaOnline(true);
          } else {
            // User hasn't set up HA yet, or the token is missing
            setHaUrl(null);
            setHaToken(null);
            setIsHaOnline(false);
          }
        } else {
          throw new Error(json.error || "Offline");
        }
      } catch (err) {
        console.error("HA Credential Fetch Error:", err.message);
        setIsHaOnline(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
    console.log("useHaCredentials: haUrl:", haUrl, "haToken:", haToken, "isHaOnline:", isHaOnline);
  }, []);

  return { haUrl, haToken, isHaOnline, loading };
}