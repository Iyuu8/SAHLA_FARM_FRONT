import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust this path if needed



export function useSensorHistory(sensorId, range) {
  const [chartData, setChartData] = useState([]);
  const [sensorMeta, setSensorMeta] = useState({ type: "", unit: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSensorData = async () => {
      if (!sensorId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get the session from Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) throw new Error("No active Supabase session found");

        const token = session.access_token; // This is your JWT

        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const response = await fetch(
          `${baseUrl}/histories/sensors/${sensorId}?range=${range}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const rawResponse = await response.json();

        // Defensive check: Ensure rawResponse has the expected structure
        if (Array.isArray(rawResponse) && rawResponse.length > 0) {
          const sensorInfo = rawResponse[0].sensor || { type: "", unit: "" };
          const timeSeriesData = rawResponse[0].data || [];

          setSensorMeta(sensorInfo);
          setChartData(
            timeSeriesData.map((item) => ({
              ...item,
            })),
          );
        } else {
          setChartData([]); // Fallback to empty chart if no data
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
          console.error("Fetch error:", err);
          setError(err.message);
          setChartData([]); // Clear old data on error
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
    return () => abortController.abort();
  }, [sensorId, range]);
  
  return { chartData, sensorMeta, isLoading, error };
}
