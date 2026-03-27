import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavigator from './TabNavigator';
import ErrorBoundary from '../components/ErrorBoundary';
import useDarkMode from '../hooks/useDarkMode';
import useLanguage from '../hooks/useLanguage';
import { Direction } from '../constants/layout';
import i18n from '../i18n';
import { useSettingsStore } from '../store/settingsStore';
import type { TabParamList } from './types';

const linking: LinkingOptions<TabParamList> = {
  prefixes: ['productexplorer://'],
  config: {
    screens: {
      ProductsTab: {
        screens: {
          ProductList: 'products',
          ProductDetail: 'products/:id',
        },
      } as never,
      FavoritesTab: 'favorites',
    },
  },
};

export default function RootNavigator() {
  const { colors, isDarkMode } = useDarkMode();
  const { isRTL } = useLanguage();
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const navTheme = {
    dark: isDarkMode,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.statusBar}
      />
      <NavigationContainer
        linking={linking}
        theme={navTheme}
        documentTitle={{ enabled: false }}
      >
        {/* Re-key on RTL change to re-render navigator with updated layout */}
        <TabNavigator key={isRTL ? Direction.RTL : Direction.LTR} />
      </NavigationContainer>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
