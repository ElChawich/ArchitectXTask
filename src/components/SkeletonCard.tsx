import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import useDarkMode from '../hooks/useDarkMode';
import { spacing, borderRadius } from '../theme/spacing';

interface SkeletonBlockProps {
  width?: number | string;
  height: number;
  style?: object;
  opacity: SharedValue<number>;
}

function SkeletonBlock({ width, height, style, opacity }: SkeletonBlockProps) {
  const { colors } = useDarkMode();
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const blockStyle = useMemo(() => ({
    width: width ?? '100%',
    height,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.sm,
  } as ViewStyle), [width, height, colors.skeleton]);

  return (
    <Animated.View style={[blockStyle, style, animatedStyle]} />
  );
}

export default function SkeletonCard() {
  const opacity = useSharedValue(1);
  const { colors } = useDarkMode();

  const dynamicStyles = useMemo(() => ({
    card: { ...styles.card, backgroundColor: colors.card, borderColor: colors.border } as ViewStyle,
  }), [colors]);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  return (
    <View style={dynamicStyles.card}>
      <SkeletonBlock height={160} opacity={opacity} />
      <View style={styles.body}>
        <SkeletonBlock height={14} width="70%" opacity={opacity} style={styles.row} />
        <SkeletonBlock height={12} width="40%" opacity={opacity} style={styles.row} />
        <View style={styles.footer}>
          <SkeletonBlock height={14} width={60} opacity={opacity} />
          <SkeletonBlock height={14} width={50} opacity={opacity} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  body: {
    padding: spacing.md,
  },
  row: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
