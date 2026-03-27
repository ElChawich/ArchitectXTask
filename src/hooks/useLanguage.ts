import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settingsStore';
import { Language } from '../constants/layout';

interface UseLanguageReturn {
  language: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function useLanguage(): UseLanguageReturn {
  const { i18n, t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const isRTL = language === Language.AR;

  const toggleLanguage = useCallback(() => {
    const newLang = language === Language.EN ? Language.AR : Language.EN;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  }, [language, setLanguage, i18n]);

  return { language, isRTL, toggleLanguage, t };
}

export default useLanguage;
