import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

let profileCache = null;
let isFetching = false;
let cachedUserId = null; // ← track which user the cache belongs to
const API_URL = process.env.REACT_APP_API_URL;
export default function useProfileData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError({ message: "Not authenticated", status: 401 });
        setLoading(false);
        return;
      }

      // If cache exists AND belongs to current user — use it
      if (profileCache && cachedUserId === session.user.id) {
        setData(profileCache);
        setLoading(false);
        return;
      }

      // Already fetching — wait for it
      if (isFetching) {
        const interval = setInterval(() => {
          if (profileCache) {
            setData(profileCache);
            setLoading(false);
            clearInterval(interval);
          }
        }, 100);
        return;
      }

      isFetching = true;

      try {
        const res = await fetch(`${API_URL}/settings/profile`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) {
          setError({
            message: json.error || "Failed to load profile",
            status: res.status,
          });
          return;
        }

        profileCache = json;
        cachedUserId = session.user.id;
        setData(json);
      } catch (err) {
        setError({ message: err.message, status: 500 });
      } finally {
        setLoading(false);
        isFetching = false;
      }
    };

    fetchProfile();
  }, []);

  const invalidateCache = () => {
    profileCache = null;
    cachedUserId = null;
  };

  return { data, loading, error, invalidateCache };
}

export const clearProfileCache = () => {
  profileCache = null;
  cachedUserId = null;
};
