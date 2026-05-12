import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
const API_URL = process.env.REACT_APP_API_URL;
const HAStatusContext = createContext(null);

export const INVALID_STATUSES = ['offline', 'error'];

export function HAStatusProvider({ children }) {
  const [haStatus, setHaStatus] = useState(null);
  const [haLoading, setHaLoading] = useState(true);

  const fetchHaStatus = useCallback(async () => {
    setHaLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setHaStatus(null);
        return;
      }
      const res = await fetch(`${API_URL}/settings/profile`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setHaStatus('error');
        return;
      }

      const data = await res.json();
      // API returns haStatus: 'online' | 'offline'
      setHaStatus(data.haStatus ?? 'offline');
    } catch (err) {
      console.error('[HAStatus] fetch failed:', err);
      setHaStatus('error');
    } finally {
      setHaLoading(false);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchHaStatus();
      if (event === 'SIGNED_OUT') {
        setHaStatus(null);
        setHaLoading(false);
      }
    });

    fetchHaStatus();
    return () => subscription.unsubscribe();
  }, [fetchHaStatus]);

  return (
    <HAStatusContext.Provider value={{ haStatus, haLoading, refetchHaStatus: fetchHaStatus }}>
      {children}
    </HAStatusContext.Provider>
  );
}

export function useHAStatus() {
  return useContext(HAStatusContext);
}