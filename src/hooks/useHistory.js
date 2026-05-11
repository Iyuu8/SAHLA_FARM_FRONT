import { useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";

const LIMIT = 20;

// Add these helper functions back
const getWeatherIcon = (state) => {
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

export default function useHistory(filters = {}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState(filters);

  useEffect(() => {
    setCurrentFilters(filters);
    setOffset(0);
    setHistory([]);
    setHasMore(true);
  }, [filters]);

  const fetchHistory = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const currentOffset = reset ? 0 : offset;

        const queryParams = new URLSearchParams();
        queryParams.append("offset", currentOffset);
        queryParams.append("limit", LIMIT);
        if (currentFilters.date)
          queryParams.append("date", currentFilters.date);
        if (currentFilters.time)
          queryParams.append("time", currentFilters.time);
        if (currentFilters.crop)
          queryParams.append("crop", currentFilters.crop);
        if (currentFilters.growthStage)
          queryParams.append("growthStage", currentFilters.growthStage);
        if (currentFilters.weather)
          queryParams.append("weather", currentFilters.weather);

        const res = await fetch(
          `http://localhost:5000/api/histories?${queryParams.toString()}`,
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
        } else {
          setHistory((prev) => [...prev, ...mapped]);
          setOffset((prev) => prev + LIMIT);
        }
        setHasMore(mapped.length === LIMIT);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, offset, currentFilters],
  );

  const loadMore = () => fetchHistory(false);
  const refresh = () => fetchHistory(true);

  useEffect(() => {
    refresh();
  }, [currentFilters]);

  return { history, loading, error, hasMore, loadMore, refresh };
}
