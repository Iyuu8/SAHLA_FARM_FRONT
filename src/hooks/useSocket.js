import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";

export default function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let socket;

    const initSocket = async () => {
      try {
        // 🔐 get token
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;

        if (!token) {
          console.warn("No token → skip socket");
          return;
        }

        // 🔌 connect WITHOUT auth first
        socket = io("http://localhost:5000", {
          transports: ["websocket"],
        });

        socketRef.current = socket;

        // ✅ connected
        socket.on("connect", () => {
          console.log("🟢 Connected:", socket.id);
          setConnected(true);

          // 🔐 send auth AFTER connect
          socket.emit("authenticate", token);
        });

        // ✅ auth success (your backend must emit this)
        socket.on("authenticated", () => {
          console.log("✅ Authenticated");
          setAuthenticated(true);
        });

        // ❌ auth failed
        socket.on("unauthorized", (msg) => {
          console.error("❌ Unauthorized:", msg);
          setAuthenticated(false);
          socket.disconnect();
        });

        socket.on("disconnect", () => {
          console.log("🔴 Disconnected");
          setConnected(false);
          setAuthenticated(false);
        });

        socket.on("connect_error", (err) => {
          console.error("🚨 Connection error:", err.message);
        });

      } catch (err) {
        console.error("Socket error:", err);
      }
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    authenticated,
  };
}