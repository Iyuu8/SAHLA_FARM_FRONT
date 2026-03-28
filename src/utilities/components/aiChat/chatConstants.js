// ─── API ──────────────────────────────────────────────────────────────────────
export const GROQ_API_KEY    = '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';
export const GROQ_MODEL      = 'llama-3.3-70b-versatile';        // text-only messages

// Replace Llama 3.2 Vision with Llama 4 Scout
export const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'; 

export const GROQ_ENDPOINT   = 'https://api.groq.com/openai/v1/chat/completions';

// ─── Farm static context (will be replaced by live data later) ────────────────
export const FARM_LOCATION = 'Sidi Bel Abbes, Algeria';
export const FARM_WEATHER  =
  'Sunny, 34°C, humidity 38%, wind 12 km/h NW. Tomorrow: heat wave expected, 38°C.';

// ─── Pill colors — assigned by index, never random ────────────────────────────
export const PILL_COLORS = ['#1A3D00', '#2E6900'];

export function pillColorForIndex(index) {
  return PILL_COLORS[index % PILL_COLORS.length];
}