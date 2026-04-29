import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";
import { useHaConfiguration } from "./HaContext.jsx";


const SocketContext = createContext(null);


export function SocketProvider({ children }) {
  const { isHAConfigured } = useHaConfiguration();
  const socketRef = useRef(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ actuators, setActuators ] = useState([]);
  const [ sensors, setSensors ] = useState([]);
  const [ crop, setCrop ] = useState({});
  const [ recommendation, setRecommendation ] = useState(null);
  const [ newNotifcations, setNewNotifications ] = useState([]);
  const [ warnings, setWarnings ] = useState([]);
  const [graphData, setGraphData] = useState(null);


    useEffect(() => {
        fetch("http://localhost:5000/api/farm/freeGraphData")
            .then(res => res.json())
            .then(data => setGraphData(data))
            .catch(err => console.error("Error fetching graph data:", err));
    }, []);

  useEffect(() => {
    let socket;

    async function initializeSocket() {
      if(!isHAConfigured) return;
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

        socket.on("initial_state", (state) => {
          setActuators(state.actuators);
          setSensors(state.sensors);
          setCrop(state.crop);
          setRecommendation(state.recommendation);
          setNewNotifications(state.notifications);
          setWarnings(state.warnings);
        });  

        socket.on("update_state", (updateState) => {
          console.log("New state happend : "+ updateState);
          if(updateState.target === "actuators") setActuators(updateState.newState);
          if(updateState.target === "sensors") setSensors(updateState.newState);
          if(updateState.target === "crop") setCrop(updateState.newState);
          if(updateState.target === "recommendation") setRecommendation(updateState.newState);
          if(updateState.target === "notifications") setNewNotifications(updateState.newState);
          if(updateState.target === "warnings") setWarnings(updateState.newState);
        });

        socket.on("ha_disconnected", () => {
          console.log("Home Assistant disconnected");
          setIsConnected(false);
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
  }, [isHAConfigured]);
  
  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, actuators, setActuators, sensors, crop, recommendation, newNotifcations, warnings, graphData }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}