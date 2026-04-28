import { useState, useEffect, useRef } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
const TRANSLATOR_URLS = [
  "https://script.google.com/macros/s/AKfycbx8_8KIcVPCRw2UpvUFRl3m6hRzpVf8b22oKDjNQsvio01PnwUkf47vfNzoocS9ATtkzw/exec",
  "https://script.google.com/macros/s/AKfycbzam1-v_3WuWak5pzt-ngD_DPQpnRj24RH4K2rcokWj3xE74KzWR-tRkD2zwiDg1ity8g/exec",
  "https://script.google.com/macros/s/AKfycbw46jmC_UgYhTLGOf7wLK_YP_EfBtbY__VjmngeB95SxxTWDjBXdrp_Rqx4uiicF74_/exec",
  "https://script.google.com/macros/s/AKfycbzK7BfxaXbn3dz95SCZPCbt9a8JMqtOFVQyTrWNk-c3wW0Hw6hNaKg8kjNlwtI7ztQ/exec",
];

const SECRET_KEY = "sahla2026"; // Added your security key

// Module-level cache: { "text__lang": "translatedText" }
const cache = {};

// ─── Component ─────────────────────────────────────────────────────────────
export default function DynamicTranslator({ text, language, className }) {
  const cacheKey = `${text}__${language}`;
  const [translatedText, setTranslatedText] = useState(() => cache[cacheKey] ?? text);
  const [loading, setLoading] = useState(false);

  const textRef = useRef(text);
  useEffect(() => { textRef.current = text; }, [text]);

  useEffect(() => {
    if (!text || !language) return;

    // Skip translation for English
    if (language === "en") {
      setTranslatedText(text);
      return;
    }

    // Serve from cache
    if (cache[cacheKey]) {
      setTranslatedText(cache[cacheKey]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const translateWithRetry = async (urlIndex = 0) => {
      if (cancelled) return;

      if (urlIndex >= TRANSLATOR_URLS.length) {
        if (!cancelled) {
          setTranslatedText(textRef.current);
          setLoading(false);
        }
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        // Added &key= to the URL string
        const url = `${TRANSLATOR_URLS[urlIndex]}?q=${encodeURIComponent(textRef.current)}&target=${language}&key=${SECRET_KEY}`;
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        const data = await response.json();

        if (!cancelled) {
          if (data.translatedText) {
            cache[cacheKey] = data.translatedText;
            setTranslatedText(data.translatedText);
            setLoading(false);
          } else {
            translateWithRetry(urlIndex + 1);
          }
        }
      } catch (error) {
        if (!cancelled) {
          translateWithRetry(urlIndex + 1);
        }
      }
    };

    translateWithRetry(0);

    return () => { cancelled = true; };
  }, [language, text]); // Added text here so changes in content trigger re-translation

  if (loading) {
    // Uses Tailwind's animate-pulse for a nice loading effect
    return <span className={`animate-pulse opacity-50 ${className}`}>...</span>;
  }

  return <span className={className}>{translatedText}</span>;
}