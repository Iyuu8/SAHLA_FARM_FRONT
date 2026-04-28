import i18n from 'i18next';

// ─── Config ────────────────────────────────────────────────────────────────
const TRANSLATOR_URLS = [
  "https://script.google.com/macros/s/AKfycbx8_8KIcVPCRw2UpvUFRl3m6hRzpVf8b22oKDjNQsvio01PnwUkf47vfNzoocS9ATtkzw/exec",
  "https://script.google.com/macros/s/AKfycbzam1-v_3WuWak5pzt-ngD_DPQpnRj24RH4K2rcokWj3xE74KzWR-tRkD2zwiDg1ity8g/exec",
  "https://script.google.com/macros/s/AKfycbw46jmC_UgYhTLGOf7wLK_YP_EfBtbY__VjmngeB95SxxTWDjBXdrp_Rqx4uiicF74_/exec",
  "https://script.google.com/macros/s/AKfycbzK7BfxaXbn3dz95SCZPCbt9a8JMqtOFVQyTrWNk-c3wW0Hw6hNaKg8kjNlwtI7ztQ/exec",
];

const SECRET_KEY = "sahla2026";

// Module-level cache: { "text__lang": "translatedText" }
const cache = {};

// In-flight promises to avoid duplicate concurrent requests for the same text
const inFlight = {};

/**
 * Hybrid Translator
 * 1. Checks local i18n JSON templates first (Fastest)
 * 2. Checks memory cache (Fast)
 * 3. Calls Google Script Cluster (Fallback)
 */
export async function translateText(text, language) {
  // 1. Basic validation
  if (!text || !language) return text;
  
  // If language is English, return original text immediately
  if (language === "en" || language.startsWith("en-")) return text;

  // 2. Local JSON Lookup (The "Template" Check)
  // Normalizes "Tomatoes " to "tomatoes" to match JSON keys
  const cleanText = text.toLowerCase().trim();
  const i18nPath = `profile.options.crops.${cleanText}`;

  if (i18n.exists(i18nPath)) {
    return i18n.t(i18nPath, { lng: language });
  }

  // 3. Cache & In-Flight Check
  const cacheKey = `${cleanText}__${language}`;
  if (cache[cacheKey]) return cache[cacheKey];
  if (inFlight[cacheKey]) return inFlight[cacheKey];

  // 4. API Translation with Retry Logic
  const translateWithRetry = async (urlIndex = 0) => {
    // If we've exhausted all URLs, return the original text
    if (urlIndex >= TRANSLATOR_URLS.length) return text;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const url = `${TRANSLATOR_URLS[urlIndex]}?q=${encodeURIComponent(text)}&target=${language}&key=${SECRET_KEY}`;
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.translatedText) {
        cache[cacheKey] = data.translatedText; // Save to memory cache
        return data.translatedText;
      } else {
        // Log warning and try the next account in the cluster
        console.warn(`Account ${urlIndex} returned no data, retrying...`);
        return translateWithRetry(urlIndex + 1);
      }
    } catch (error) {
      console.warn(`Translation error on account ${urlIndex}:`, error.message);
      return translateWithRetry(urlIndex + 1);
    }
  };

  // Assign to inFlight to prevent multiple calls for the same word at the same time
  inFlight[cacheKey] = translateWithRetry().finally(() => {
    delete inFlight[cacheKey];
  });

  return inFlight[cacheKey];
}