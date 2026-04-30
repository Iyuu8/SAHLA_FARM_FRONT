// useHACameraStream.js
import { useEffect, useRef, useState, useCallback } from 'react';

const HA_IP = '172.19.32.237:8123';
const TOKEN = '2f5f57e71c3bbe93b8520168c07369ae60d28d0377eedc94d5941792b185347a'; // From HA entity details
const ENTITY_ID = 'camera.farm_camera_farm_camera_feed';

export function useHACameraStream() {
  const [frameUrl, setFrameUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);
  const streamingRef = useRef(false);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    streamingRef.current = true;

    try {
      // For MJPEG stream, we need to use the proxy endpoint with Bearer token
      const response = await fetch(`http://${HA_IP}/api/camera_proxy_stream/${ENTITY_ID}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Authentication failed. Check your token.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read the stream
      const reader = response.body.getReader();
      const chunks = [];
      
      while (streamingRef.current) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

    } catch (err) {
      if (streamingRef.current) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    streamingRef.current = false;
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setFrameUrl(null);
  }, []);

  // Alternative: Use snapshot endpoint (updates every few seconds)
  const fetchSnapshot = useCallback(async () => {
    try {
      const response = await fetch(`http://${HA_IP}/api/camera_proxy/${ENTITY_ID}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFrameUrl(url);
      return url;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return { frameUrl, error, isLoading, startStream, stopStream, fetchSnapshot };
}