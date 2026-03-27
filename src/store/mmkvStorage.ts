import { createMMKV } from 'react-native-mmkv';

export function createMmkvStorage(id: string) {
  const storage = createMMKV({ id });

  return {
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
}
