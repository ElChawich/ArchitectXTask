import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language } from '../constants/layout';
import { createMmkvStorage } from './mmkvStorage';

const mmkvStorage = createMmkvStorage('settings-storage');

interface SettingsState {
  language: Language;
  isDarkMode: boolean;
  setLanguage: (language: Language) => void;
  toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: Language.EN,
      isDarkMode: false,
      setLanguage: (language) => set({ language }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
