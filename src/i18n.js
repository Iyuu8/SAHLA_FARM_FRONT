import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Import your JSON dictionaries!
import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';
import translationFR from './locales/fr.json';

// 2. Map them to the languages
const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  fr: { translation: translationFR }
};

// 3. Initialize the engine
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language when the app loads
    fallbackLng: 'en', // If a translation is missing, it will use English
    interpolation: {
      escapeValue: false // React already protects from XSS attacks safely
    }
  });

export default i18n;