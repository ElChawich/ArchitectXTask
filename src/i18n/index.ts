import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import ar from './translations/ar';
import { Language } from '../constants/layout';

i18n.use(initReactI18next).init({
  resources: {
    [Language.EN]: { translation: en },
    [Language.AR]: { translation: ar },
  },
  lng: Language.EN,
  fallbackLng: Language.EN,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
