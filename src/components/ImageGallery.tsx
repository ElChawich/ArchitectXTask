import React, { useState, useMemo } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  ImageStyle,
} from 'react-native';
import useDarkMode from '../hooks/useDarkMode';
import useLanguage from '../hooks/useLanguage';
import { Direction } from '../constants/layout';
import { spacing } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const imageSources = useMemo(
    () => images.map((uri) => ({ uri, cache: 'force-cache' as const })),
    [images],
  );

  const dynamicStyles = useMemo(() => ({
    image: { ...styles.image, backgroundColor: colors.skeleton } as ImageStyle,
    dotsContainer: { ...styles.dotsContainer, direction: isRTL ? Direction.RTL : Direction.LTR },
  }), [colors, isRTL]);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  // Per-dot styles depend on both colors and activeIndex — computed per item
  const getDotStyle = (index: number) => ({
    backgroundColor: index === activeIndex ? colors.primary : colors.border,
    width: index === activeIndex ? 16 : 6,
  });

  return (
    <View>
      <View style={isRTL ? styles.mirror : undefined}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          accessibilityRole="adjustable"
          accessibilityLabel={t('accessibility.imageGallery', { title })}
          accessibilityHint={t('accessibility.imageGalleryHint', { count: images.length })}
        >
          {imageSources.map((src, index) => (
            <View key={src.uri} style={isRTL ? styles.mirror : undefined}>
              <Image
                source={src}
                style={dynamicStyles.image}
                resizeMode="contain"
                accessibilityLabel={t('accessibility.imageItem', {
                  title,
                  index: index + 1,
                  total: images.length,
                })}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      {images.length > 1 && (
        <View style={dynamicStyles.dotsContainer} accessibilityElementsHidden>
          {images.map((_, index) => (
            <View key={index} style={[styles.dot, getDotStyle(index)]} />
          ))}
        </View>
      )}
      <Text style={styles.counter} accessibilityElementsHidden>
        {t('accessibility.imageCounter', { current: activeIndex + 1, total: images.length })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  counter: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: spacing.xs,
  },
});
