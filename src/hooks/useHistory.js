import { useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useHaConfiguration } from "../context/HaContext.jsx";

const LIMIT = 20;

const getWeatherIcon = (state) => {
  // Map weather state to icon — reuse existing icons
  const map = {
    sunny: "sunny",
    cloudy: "cloudy",
    rainy: "rainy",
    stormy: "stormy",
    windy: "windy",
    night: "night",
  };
  return map[state?.toLowerCase()] || "sunny";
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}`,
  };
};

export default function useHistory() {
  const { isHAConfigured, configurationError } = useHaConfiguration();  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = useCallback(
    async (reset = false) => {
      setError(null);
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const currentOffset = reset ? 0 : offset;

        const res = await fetch(
          `http://localhost:5000/api/histories?offset=${currentOffset}&limit=${LIMIT}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load history");

        const mapped = (json.history || []).map((item) => {
          const { date, time } = formatTimestamp(item.timestamp);
          return {
            id: item.id,
            date,
            time,
            crop: item.crop?.type || "",
            growthStage: item.crop?.growth_stage || "",
            weather: item.weather?.state || "",
            weatherIcon: getWeatherIcon(item.weather?.state),
          };
        });

        if (reset) {
          setHistory(mapped);
          setOffset(LIMIT);
          setLoading(false);
        } else {
          setHistory((prev) => [...prev, ...mapped]);
          setOffset((prev) => prev + LIMIT);
          setLoadingMore(false);
        }

        setHasMore(mapped.length === LIMIT);
      } catch (err) {
        setError(err.message);
        if (reset) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [offset],
  );

  useEffect(() => {
    if (!isHAConfigured && configurationError?.status !== "haDown") return
    fetchHistory(true);
  }, [isHAConfigured, configurationError]);

  const loadMore = () => fetchHistory(false);

  return { history, loading, error, hasMore, loadMore, loadingMore };
}
