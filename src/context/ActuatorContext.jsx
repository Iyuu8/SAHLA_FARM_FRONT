import React, { createContext, useContext, useEffect, useMemo } from 'react';
import useActuatorsState from '../hooks/useActuatorsState'; // Keep this if it defines the default array
import { useSocket } from './SocketContext';
import useLiveState, { ID_TO_ACTUATOR_TYPE } from '../hooks/useLiveState';

const ActuatorContext = createContext();

export function ActuatorProvider({ children }) {
  const [actuators, setActuators] = useActuatorsState();
  const { socket, isAuthenticated } = useSocket();
  const { liveActuators } = useLiveState();

  // 1. Sync live data
  useEffect(() => {
    if (!liveActuators) return;
    const normalizedLive = Array.isArray(liveActuators) ? liveActuators : [liveActuators];
    if (normalizedLive.length === 0) return;

    setActuators((prev) => {
      let hasChanges = false; // 🛡️ Our bailout flag

      const nextState = prev.map((actuator) => {
        const expectedBackendType = ID_TO_ACTUATOR_TYPE[actuator.id] || actuator.id;
        const live = normalizedLive.find((a) => a?.type === expectedBackendType);
        if (!live) return actuator;

        const runAt = live.run_at ?? null;
        const runUntil = live.run_until ?? null;

        let updatedSchedule = '';
        if (live.control_mode === 'auto') {
          if (runAt && runUntil) {
            updatedSchedule = `${runAt.slice(11, 16)} - ${runUntil.slice(11, 16)}`;
          } else if (runAt) {
            updatedSchedule = `Exec at ${runAt.slice(11, 16)}`;
          } else if (runUntil) {
            updatedSchedule = `Exec at ${runUntil.slice(11, 16)}`; // (Fixed a typo here too!)
          } else {
            updatedSchedule = 'Not Scheduled';
          }
        } else {
          updatedSchedule = 'Manual';
        }

        const newStatus = live.status ?? actuator.status;
        const newMode = live.control_mode === 'semi_auto' ? 'semi-auto' : live.control_mode === 'auto' ? 'auto' : actuator.mode;

        // 🛡️ Did anything ACTUALLY change?
        if (actuator.status !== newStatus || actuator.mode !== newMode || actuator.schedule !== updatedSchedule) {
          hasChanges = true;
        }

        return {
          ...actuator,
          status: newStatus,
          mode: newMode,
          schedule: updatedSchedule,
          run_at: runAt,
          run_until: runUntil,
          duration_minutes: live.duration_minutes ?? null,
          raw: { ...actuator.raw, ...live },
        };
      });

      return hasChanges ? nextState : prev; 
    });
  }, [liveActuators, setActuators]);

  // 2. Derive global mode
  const globalMode = useMemo(() => {
    return actuators.every((a) => a.mode === 'auto') ? 'auto' : 'semi-auto';
  }, [actuators]);

  // 3. Shared Actions (Move handleToggle functions from Dashboard/Profile here)
  const handleToggleGlobalMode = (isManual) => {
    const nextMode = isManual ? 'semi-auto' : 'auto';
    setActuators((prev) => prev.map(a => {
      socket?.emit('set_entity', {
        type: 'actuator_control_mode',
        payload: { actuatorType: ID_TO_ACTUATOR_TYPE[a.id] ?? a.id, value: isManual ? 'semi_auto' : 'auto' },
      });
      return { ...a, mode: nextMode };
    }));
  };

  const handleToggleActuatorStatus = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) => {
        if (actuator.id !== actuatorId) return actuator;
        if (actuator.mode !== 'semi-auto') return actuator;
        const nextStatus = actuator.status === 'on' ? 'off' : 'on';
        socket?.emit('set_entity', {
          type: 'actuator_status',
          payload: {
            actuatorType: ID_TO_ACTUATOR_TYPE[actuatorId] ?? actuatorId,
            value: nextStatus,
          },
        });
        return { ...actuator, status: nextStatus };
      })
    );
  
  };
  const handleToggleActuatorMode = (actuatorId) => {
      setActuators((prev) =>
        prev.map((actuator) => {
          if (actuator.id !== actuatorId) return actuator;
          const nextMode = actuator.mode === 'semi-auto' ? 'auto' : 'semi-auto';
          socket?.emit('set_entity', {
            type: 'actuator_control_mode',
            payload: {
              actuatorType: ID_TO_ACTUATOR_TYPE[actuatorId] ?? actuatorId,
              value: nextMode === 'semi-auto' ? 'semi_auto' : 'auto',
            },
          });
          return { ...actuator, mode: nextMode };
        })
      );
    };
  return (
    <ActuatorContext.Provider value={{ 
      actuators, globalMode, handleToggleGlobalMode, handleToggleActuatorStatus, handleToggleActuatorMode
    }}>
      {children}
    </ActuatorContext.Provider>
  );
}

export function useGlobalActuators() {
  return useContext(ActuatorContext);
}