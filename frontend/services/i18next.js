import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import cat from '../locales/cat.json';

export const languageResources = {
  en: {translation: en},
  es: {translation: es},
  cat: {translation: cat},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'cat',
  fallbackLng: 'cat',
  resources: languageResources,
});

export default i18next;