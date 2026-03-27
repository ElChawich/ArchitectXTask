import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { Product } from '../api/types';

interface HeartButtonProps {
  product: Product;
  isFav: boolean;
  onToggle: (product: Product) => void;
  size?: number;
}

export default function HeartButton({ product, isFav, onToggle, size = 22 }: HeartButtonProps) {
  const scale = useSharedValue(1);
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: size,
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 300 }),
      withTiming(1, { duration: 300 }),
    );
    onToggle(product);
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityLabel={isFav ? t('removeFromFavorites') : t('addToFavorites')}
      accessibilityRole="button"
      accessibilityState={{ selected: isFav }}
    >
      <Animated.Text style={animatedStyle}>
        {isFav ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}
