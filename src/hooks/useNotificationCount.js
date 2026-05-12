import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
const API_URL = process.env.REACT_APP_API_URL;
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
      const res = await fetch(`${API_URL}/notifications/count`, {
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

  // Optimistic decrement — floors at 0
  const decrement = useCallback((by = 1) => {
    setCount((prev) => Math.max(0, prev - by));
  }, []);

  useEffect(() => {
    fetchCount();
    const onFocus = () => fetchCount();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount, decrement };
}