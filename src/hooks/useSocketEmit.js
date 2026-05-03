import { useSocket } from "../context/SocketContext";
import React, { useCallback } from "react";

/**
 * Hook to emit socket events to the backend
 *
 * Usage:
 * const emit = useSocketEmit();
 *
 * // Set actuator status (pump on/off)
 * emit('set_entity', {
 *   type: 'actuator_status',
 *   payload: { actuatorType: 'pump', value: 'on' }
 * });
 *
 * // Set actuator control mode
 * emit('set_entity', {
 *   type: 'actuator_control_mode',
 *   payload: { actuatorType: 'pump', value: 'auto' }
 * });
 *
 * // Set crop type
 * emit('set_entity', {
 *   type: 'crop',
 *   payload: { field: 'type', value: 'Tomato' }
 * });
 */
export function useSocketEmit() {
  const { socket, isAuthenticated } = useSocket();

  const emit = useCallback(
    (eventName, data) => {
      if (!socket) {
        console.warn("Socket not initialized yet");
        return;
      }

      if (!isAuthenticated) {
        console.warn("Not authenticated with socket");
        return;
      }

      socket.emit(eventName, data);
    },
    [socket, isAuthenticated],
  );

  return emit;
}

/**
 * Hook to listen for socket errors
 */
export function useSocketErrors(onError) {
  const { socket } = useSocket();

  React.useEffect(() => {
    if (!socket) return;

    const handleSetEntityError = (data) => {
      console.error("set_entity error:", data);
      onError?.(data);
    };

    const handleHAError = (data) => {
      console.error("HA error:", data);
      onError?.(data);
    };

    socket.on("set_entity_error", handleSetEntityError);
    socket.on("ha_error", handleHAError);

    return () => {
      socket.off("set_entity_error", handleSetEntityError);
      socket.off("ha_error", handleHAError);
    };
  }, [socket, onError]);
}
