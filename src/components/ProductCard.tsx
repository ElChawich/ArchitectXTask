import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import HeartButton from './HeartButton';
import useDarkMode from '../hooks/useDarkMode';
import useLanguage from '../hooks/useLanguage';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import type { Product } from '../api/types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export default function ProductCard({
  product,
  onPress,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const scale = useSharedValue(1);
  const { colors } = useDarkMode();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const thumbnailSrc = useMemo(
    () => ({ uri: product.thumbnail, cache: 'force-cache' as const }),
    [product.thumbnail],
  );

  const dynamicStyles = useMemo(() => ({
    card: { ...styles.card, backgroundColor: colors.card, borderColor: colors.border } as ViewStyle,
    image: { ...styles.image, backgroundColor: colors.skeleton } as ImageStyle,
    row: { ...styles.row, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    title: { ...styles.title, color: colors.text, textAlign: isRTL ? 'right' : 'left', flex: 1 } as TextStyle,
    category: { ...styles.category, color: colors.primary, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    footer: { ...styles.footer, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    price: { ...styles.price, color: colors.text } as TextStyle,
    star: { color: colors.star } as TextStyle,
    rating: { ...styles.rating, color: colors.textSecondary } as TextStyle,
  }), [colors, isRTL]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={dynamicStyles.card}
        accessibilityRole="button"
        accessibilityLabel={`${product.title}, $${product.price}`}
        accessibilityHint={t('accessibility.productCardHint')}
      >
        <Image
          source={thumbnailSrc}
          style={dynamicStyles.image}
          resizeMode="cover"
          accessibilityElementsHidden
        />
        <View style={styles.body}>
          <View style={dynamicStyles.row}>
            <Text style={dynamicStyles.title} numberOfLines={2}>
              {product.title}
            </Text>
            <HeartButton
              product={product}
              isFav={isFavorite}
              onToggle={onToggleFavorite}
            />
          </View>

          <Text style={dynamicStyles.category}>
            {product.category}
          </Text>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.price}>
              ${product.price.toFixed(2)}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={dynamicStyles.star}>★</Text>
              <Text style={dynamicStyles.rating}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: spacing.md,
  },
  row: {
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: 20,
  },
  category: {
    fontSize: fontSize.sm,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: fontSize.sm,
  },
});
