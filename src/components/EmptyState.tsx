import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import useDarkMode from '../hooks/useDarkMode';
import useLanguage from '../hooks/useLanguage';
import { spacing, fontSize } from '../theme/spacing';

export default function EmptyState() {
  const { colors } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const dynamicStyles = useMemo(() => ({
    title: {
      ...styles.title,
      color: colors.text,
      textAlign: isRTL ? 'right' : 'center',
    } as TextStyle,
    subtitle: {
      ...styles.subtitle,
      color: colors.textSecondary,
      textAlign: isRTL ? 'right' : 'center',
    } as TextStyle,
  }), [colors, isRTL]);

  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.icon} accessibilityElementsHidden>
        🤍
      </Text>
      <Text style={dynamicStyles.title}>
        {t('favorites.empty')}
      </Text>
      <Text style={dynamicStyles.subtitle}>
        {t('favorites.emptySubtitle')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
});
