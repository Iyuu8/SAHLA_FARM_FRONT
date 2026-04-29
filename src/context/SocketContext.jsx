import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
/* 
  useEffect(() => {
    let socket;

    async function initializeSocket() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          console.error("No valid session");
          return;
        }

        const session = data.session;

        socket = io("http://localhost:5000", {
          transports: ["websocket"],
          autoConnect: false,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          setIsConnected(true);

          socket.emit("authenticate", {
            token: session.access_token,
          });
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.connect();
      } catch (err) {
        console.error("Socket init error:", err);
      }
    }

    initializeSocket();

    // ✅ PROPER CLEANUP
    return () => {
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    };
  }, []);
  */
  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}