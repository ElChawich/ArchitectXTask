import { useCallback } from 'react';
import { Platform } from 'react-native';
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Product } from '../api/types';

const hapticType = Platform.OS === 'android'
  ? HapticFeedbackTypes.effectClick
  : HapticFeedbackTypes.impactLight;

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface UseFavoritesReturn {
  favorites: Product[];
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
}

function useFavorites(): UseFavoritesReturn {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const toggleFavoriteStore = useFavoritesStore((state) => state.toggleFavorite);

  const toggleFavorite = useCallback(
    (product: Product) => {
      try {
        ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
      } catch {
        // Haptic feedback not available on this device/platform
      }
      toggleFavoriteStore(product);
    },
    [toggleFavoriteStore],
  );

  return { favorites, isFavorite, toggleFavorite };
}

export default useFavorites;
