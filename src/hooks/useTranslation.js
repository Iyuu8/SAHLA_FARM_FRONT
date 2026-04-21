import { useState, useEffect } from 'react';

const cache = {}; // avoid translating the same text twice

async function translateText(text, targetLang) {
  if (targetLang === "en") return text; // no need to translate
  const key = `${text}_${targetLang}`;
  if (cache[key]) return cache[key]; // return cached result

  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });
    const data = await res.json();
    cache[key] = data.translatedText;
    return data.translatedText;
  } catch {
    return text; // fallback to original if API fails
  }
}

export function useTranslation(language) {
  const langMap = { "English": "en", "Français": "fr", "العربية": "ar" };
  const lang = langMap[language] || "en";

  const t = async (text) => await translateText(text, lang);

  return { t, lang };
}