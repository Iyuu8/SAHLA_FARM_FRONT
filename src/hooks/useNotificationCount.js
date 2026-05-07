// hooks/useNotificationCount.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useNotificationCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("http://localhost:5000/api/notifications/count", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch count");
        setCount(json.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Optional: refetch when window gains focus (e.g., after returning from notifications page)
    const onFocus = () => fetchCount();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchCount]);
  console.log("-*-*-*-*-*-*-**Current notification count in hook state:", count); // Debug log to verify count updates 
  return { count, loading, error, refetch: fetchCount };
}
