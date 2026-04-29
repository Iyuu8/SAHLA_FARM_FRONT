import { useSocket } from "../context/SocketContext.jsx";


export function useFarmDataActions() {
  const { socket, setFarmStatus } = useSocket();

  const setActuators = (newActuators) => {
    if (socket && socket.connected) {
      socket.emit("update_actuators", newActuators);
      setFarmStatus((prevStatus) => ({
        ...prevStatus,
        actuators: newActuators,
      }));
    } else {
      console.error("Socket not connected. Cannot send actuator updates.");
    }
  }


  const setCropInfo = (newCropInfo) => {
    if (socket && socket.connected) {
      socket.emit("update_crop_info", newCropInfo);
      setFarmStatus((prevStatus) => ({
        ...prevStatus,
        cropInfo: newCropInfo,
      }));
    } else {
      console.error("Socket not connected. Cannot send crop info updates.");
    }
  }



  return { setActuators, setCropInfo };
}
