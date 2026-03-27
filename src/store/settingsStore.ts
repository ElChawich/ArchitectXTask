import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Language } from '../constants/layout';

const storage = createMMKV({ id: 'settings-storage' });

const mmkvStorage = {
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};

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
