import { DASHBOARD_ACTUATORS } from '../utilities/data/dashboardData';
import { STORAGE_KEYS } from '../utilities/data/storageKeys';
import usePersistentState from './usePersistentState';

/**
 * Shared actuator store.
 *
 * Dashboard updates actuator status/mode and AI chat reads the same stored data
 * to keep automation context consistent without prop drilling.
 */
export default function useActuatorsState() {
  return usePersistentState(STORAGE_KEYS.actuators, DASHBOARD_ACTUATORS);
}
