// src/utilities/data/storageKeys.js

// Browser storage keys used by frontend-only simulation.
// These are centralized to avoid duplicated string literals across pages/hooks.
export const STORAGE_KEYS = {
  profile: 'sahla_profile_info',
  chatHistory: 'sahla_chat_history',
  actuators: 'sahla_actuators_state',
  farmPreferences: 'sahla_farm_preferences',
  dashboardView: 'sahla_dashboard_view',
};
