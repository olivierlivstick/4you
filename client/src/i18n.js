import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import pl from './locales/pl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
      pt: { translation: pt },
      de: { translation: de },
      pl: { translation: pl },
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    supportedLngs: ['de', 'en', 'es', 'fr', 'it', 'pl', 'pt'],
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLngManual',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
