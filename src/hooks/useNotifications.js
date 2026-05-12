import { useState, useEffect, useCallback, useContext } from "react";
import { supabase } from "../supabaseClient";
import { NotificationsContext } from "../layout";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const PAGE_SIZE = 15;

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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const { decrementCount, refetchNotificationCount } =
    useContext(NotificationsContext) || {};

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    return session;
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setOffset(0);
    try {
      const session = await getSession();
      const res = await fetch(
        `${API_URL}/notifications?limit=${PAGE_SIZE}&offset=0`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load notifications");
        return;
      }
      const mapped = (json.notifications || []).map(mapNotification);
      setNotifications(mapped);
      setOffset(mapped.length);
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const session = await getSession();
      const res = await fetch(
        `${API_URL}/notifications?limit=${PAGE_SIZE}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const json = await res.json();
      if (!res.ok) return;
      const mapped = (json.notifications || []).map(mapNotification);
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const fresh = mapped.filter((n) => !existingIds.has(n.id));
        return [...prev, ...fresh];
      });
      setOffset((prev) => prev + mapped.length);
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, offset]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    const notification = notifications.find((n) => n.id === id);
    // Only act if it was actually unread
    if (!notification || notification.isRead) return;

    // 1. Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    // 2. Optimistic count decrement in header badge
    decrementCount?.(1);

    try {
      const session = await getSession();
      await fetch(`${API_URL}/notifications/${id}?status=read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      // 3. Background re-fetch to reconcile real server count
      refetchNotificationCount?.();
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Rollback on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );
      refetchNotificationCount?.();
    }
  };

  const markAllAsRead = async () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    if (unreadCount === 0) return;

    // 1. Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // 2. Optimistic decrement by loaded unread count
    decrementCount?.(unreadCount);

    try {
      const session = await getSession();
      await fetch(`${API_URL}/notifications/all?status=read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      // 3. Re-fetch — DB clears ALL unread (including unloaded pages)
      refetchNotificationCount?.();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      refetchNotificationCount?.();
    }
  };

  return {
    notifications,
    setNotifications,
    loading,
    loadingMore,
    hasMore,
    error,
    markAsRead,
    markAllAsRead,
    loadMore,
    refetch: fetchNotifications,
  };
}