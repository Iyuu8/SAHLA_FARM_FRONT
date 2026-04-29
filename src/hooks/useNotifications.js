import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useHaConfiguration } from "../context/HaContext.jsx";

const LIMIT = 50;

const getDateGroup = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 24 && now.getDate() === date.getDate()) return "today";
  if (diffDays < 2 && now.getDate() - date.getDate() === 1) return "yesterday";
  return "earlier";
};

const formatTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const mapNotification = (n) => ({
  id: n.id,
  title: n.title,
  description: n.description,
  time: formatTime(n.timestamp),
  date: getDateGroup(n.timestamp),
  isRead: n.isRead,
  timestamp: n.timestamp,
});

export default function useNotifications() {
  const { isHAConfigured, configurationError } = useHaConfiguration();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isHAConfigured && configurationError?.status !== "haDown") return
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(
        `http://localhost:5000/api/notifications?limit=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load notifications");
        setLoading(false);
        return;
      }

      // Backend returns { notifications: [...] } not a plain array
      setNotifications((json.notifications || []).map(mapNotification));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotifications();
  }, [isHAConfigured, configurationError]);

  const markAsRead = async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`http://localhost:5000/api/notifications/${id}?status=read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`http://localhost:5000/api/notifications/all?status=read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return {
    notifications,
    setNotifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
