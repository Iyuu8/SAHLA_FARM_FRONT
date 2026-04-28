import { useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function useHistoryDetail() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setDetail(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(`http://localhost:5000/api/histories/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Failed to load history detail");

      setDetail(json.run);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { detail, loading, error, fetchDetail };
}
