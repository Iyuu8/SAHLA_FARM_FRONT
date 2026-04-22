export const WARNING_CONFIG_MAP = {
  'frost risk': {
    displayTitle: 'Risk of frost, Low temperature',
    icon: '/frost.svg', // Points to public/frost.svg
    color: '#3A78C9',
  },
  'heavy rainfall': {
    displayTitle: 'Heavy Rainfall',
    icon: '/rain.svg',
    color: '#1A4A8A',
  },
  'high humidity level': {
    displayTitle: 'High Humidity Level',
    icon: '/hhum.svg',
    color: '#6A5A9A',
  },
  'high temperature detected': {
    displayTitle: 'High temperature detected',
    icon: '/htemp.svg',
    color: '#D17254',
  },
  'insufficient sunlight': {
    displayTitle: 'Insufficient Sunlight',
    icon: '/lsun.svg',
    color: '#6A7A2A',
  },
  'excessive sunlight': {
    displayTitle: 'Excessive Sunlight',
    icon: '/hsun.svg',
    color: '#C98010',
  },
  'low soil moisture': {
    displayTitle: 'Low Soil Moisture',
    icon: '/lsoil.svg',
    color: '#A0581E',
  },
  'overwatering': {
    displayTitle: 'Overwatering, High soil moisture',
    icon: '/overwat.svg',
    color: '#0E8A96',
  },
  'strong wind': {
    displayTitle: 'Strong Wind',
    icon: '/wind.svg',
    color: '#4A6A8A',
  },
};

// 2. The transformation function
export function formatWarningsToUI(apiWarnings) {
  if (!apiWarnings || !Array.isArray(apiWarnings)) return [];

  return apiWarnings
    .filter((warning) => String(warning.status || '').toLowerCase() === 'active')
    .map((warning) => {
    // Normalize the title string (e.g. "high_temperature_detected" -> "high temperature detected")
    const normalizedKey = warning.title.replace(/_/g, ' ').toLowerCase();

    // Look up the config, or use a fallback if an unknown warning arrives
    const config = WARNING_CONFIG_MAP[normalizedKey] || {
      displayTitle: warning.title.replace(/_/g, ' '),
      icon: '/htemp.svg',
      color: '#FFFFFF',
    };

    return {
      id: warning.id,
      title: config.displayTitle,
      status: warning.status,
      icon: config.icon,
      color: config.color,
      // Pass along description and severity so the Modal can still use them!
      description: warning.description,
      severity: warning.severity,
    };
  });
}