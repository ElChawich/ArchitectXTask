import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import useDarkMode from '../hooks/useDarkMode';
import useLanguage from '../hooks/useLanguage';
import { Direction } from '../constants/layout';
import { spacing, borderRadius, fontSize } from '../theme/spacing';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorState({ onRetry, message }: ErrorStateProps) {
  const { colors } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const dynamicStyles = useMemo(() => ({
    container: {
      ...styles.container,
      backgroundColor: colors.errorBackground,
      direction: isRTL ? Direction.RTL : Direction.LTR,
    } as ViewStyle,
    title: {
      ...styles.title,
      color: colors.error,
      textAlign: isRTL ? 'right' : 'left',
    } as TextStyle,
    message: {
      ...styles.message,
      color: colors.textSecondary,
      textAlign: isRTL ? 'right' : 'left',
    } as TextStyle,
    button: { ...styles.button, backgroundColor: colors.error } as ViewStyle,
  }), [colors, isRTL]);

  return (
    <View style={dynamicStyles.container} accessibilityLiveRegion="assertive">
      <Text style={styles.icon} accessibilityElementsHidden>
        ⚠️
      </Text>
      <Text style={dynamicStyles.title} accessibilityRole="text">
        {t('error.title')}
      </Text>
      <Text style={dynamicStyles.message}>
        {message ?? t('error.message')}
      </Text>
      <Pressable
        style={dynamicStyles.button}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t('error.retry')}
      >
        <Text style={styles.buttonText}>{t('error.retry')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.md,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: fontSize.md,
  },
});
