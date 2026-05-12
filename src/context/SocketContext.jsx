import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { supabase } from '../supabaseClient';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [liveState, setLiveState] = useState(null);

  useEffect(() => {
    let instance = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const socketUrl = process.env.REACT_APP_API_URL 
        ? process.env.REACT_APP_API_URL.replace(/\/api$/, "") 
        : 'http://localhost:5000';
      instance = io(socketUrl, {
        transports: ['websocket'],
      });

      instance.on('connect', () => {
        console.log('[Socket] Connected — authenticating...');
        console.log('[Socket] Sending token:', session.access_token?.slice(0, 20) + '...');
        instance.emit('authenticate', { token: session.access_token });
      });

      instance.on('auth_success', ({ ha_instance_id, initialState }) => {
        console.log('[Socket] auth_success fired! ha_instance_id:', ha_instance_id);
        console.log('[Socket] initialState:', initialState);
        setIsAuthenticated(true);
        if (initialState) setLiveState(initialState);
      });

      instance.on('auth_error', ({ message }) => {
        console.error('[Socket] Auth error:', message);
        setIsAuthenticated(false);
        instance.disconnect();
      });

      instance.on('ha_disconnected', ({ message }) => {
        console.warn('[Socket] HA disconnected:', message);
      });

      instance.on('ha_error', ({ message }) => {
        console.error('[Socket] HA error:', message);
        setIsAuthenticated(false);
      });

      instance.on('disconnect', () => {
        console.log('[Socket] Disconnected');
        setIsAuthenticated(false);
        setLiveState(null);
      });

      socketRef.current = instance;
      setSocket(instance);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') init();
      if (event === 'SIGNED_OUT') {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsAuthenticated(false);
        setLiveState(null);
      }
    });

    init();

    return () => {
      subscription.unsubscribe();
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isAuthenticated, liveState }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}