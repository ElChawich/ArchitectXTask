import React, { Activity, useCallback, useMemo } from 'react';
import { Text, StyleSheet, Pressable, Switch, View, ViewStyle, TextStyle } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import ProductListScreen from '../features/products/screens/ProductListScreen';
import ProductDetailScreen from '../features/products/screens/ProductDetailScreen';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import useDarkMode from '../hooks/useDarkMode';
import type { FavoritesScreenProps } from './types';
import useLanguage from '../hooks/useLanguage';
import { Direction } from '../constants/layout';
import type { TabParamList, ProductsStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

interface TabIconProps {
  focused: boolean;
  label: string;
  colors: ReturnType<typeof useDarkMode>['colors'];
}

function TabIcon({ focused, label, colors }: TabIconProps) {
  const scale = useSharedValue(focused ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 12 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text
      style={[
        styles.tabIcon,
        animatedStyle,
        { color: focused ? colors.tabBarActive : colors.tabBarInactive },
      ]}
      accessibilityElementsHidden
    >
      {label}
    </Animated.Text>
  );
}

function ProductsNavigator() {
  const { t } = useTranslation();
  const { colors } = useDarkMode();
  const { isRTL } = useLanguage();

  const dynamicStyles = useMemo(() => ({
    headerStyle: { backgroundColor: colors.card as string },
    headerTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '600' as const,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
      textAlignVertical: 'center',
    } as TextStyle,
  }), [colors, isRTL]);

  return (
    <ProductsStack.Navigator
      screenOptions={{
        headerStyle: dynamicStyles.headerStyle,
        headerTintColor: colors.text,
        headerTitleAlign: 'left',
        headerTitle: ({ children }) => (
          <Text style={dynamicStyles.headerTitle} numberOfLines={1}>
            {children}
          </Text>
        ),
        animation: isRTL ? 'slide_from_left' : 'slide_from_right',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <ProductsStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: t('screens.products') }}
      />
      <ProductsStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: isRTL ? t('back') : undefined,
        })}
      />
    </ProductsStack.Navigator>
  );
}

function ProductsTabScreen() {
  const isFocused = useIsFocused();
  return (
    <Activity mode={isFocused ? 'visible' : 'hidden'}>
      <ProductsNavigator />
    </Activity>
  );
}

function FavoritesTabScreen(_props: FavoritesScreenProps) {
  const isFocused = useIsFocused();
  return (
    <Activity mode={isFocused ? 'visible' : 'hidden'}>
      <FavoritesScreen />
    </Activity>
  );
}

export default function TabNavigator() {
  const { t } = useTranslation();
  const { colors, isDarkMode, toggleDarkMode } = useDarkMode();
  const { isRTL } = useLanguage();

  const dynamicStyles = useMemo(() => ({
    tabBar: {
      backgroundColor: colors.tabBar,
      borderTopColor: colors.border,
      direction: isRTL ? Direction.RTL : Direction.LTR,
    } as ViewStyle,
    tabBarLabel: {
      fontFamily: isRTL ? 'System' : undefined,
    } as TextStyle,
    darkModeIcon: { color: colors.textSecondary, fontSize: 12, marginRight: 4 } as TextStyle,
    favHeader: { backgroundColor: colors.card } as ViewStyle,
    favHeaderTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '600' as const,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
      textAlignVertical: 'center',
    } as TextStyle,
  }), [colors, isRTL]);

  const renderProductsIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <TabIcon focused={focused} label="🛍️" colors={colors} />
    ),
    [colors],
  );

  const renderFavoritesIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <TabIcon focused={focused} label="❤️" colors={colors} />
    ),
    [colors],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: dynamicStyles.tabBar,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: dynamicStyles.tabBarLabel,
        tabBarButton: ({ children, onPress, style, accessibilityState }) => (
          <Pressable
            onPress={onPress}
            style={style}
            android_ripple={{ color: colors.primaryLight }}
            accessibilityRole="tab"
            accessibilityState={accessibilityState}
          >
            {children}
          </Pressable>
        ),
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsTabScreen}
        options={{
          title: t('screens.products'),
          tabBarIcon: renderProductsIcon,
          tabBarAccessibilityLabel: t('screens.products'),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesTabScreen}
        options={{
          title: t('screens.favorites'),
          tabBarIcon: renderFavoritesIcon,
          tabBarAccessibilityLabel: t('screens.favorites'),
          headerShown: true,
          headerStyle: dynamicStyles.favHeader,
          headerTintColor: colors.text,
          headerTitleAlign: 'left',
          headerTitle: ({ children }) => (
            <Text style={dynamicStyles.favHeaderTitle} numberOfLines={1}>
              {children}
            </Text>
          ),
          headerLeft: isRTL
            ? () => (
                <View style={styles.darkModeRow} accessibilityRole="none">
                  <Text style={dynamicStyles.darkModeIcon}>
                    {isDarkMode ? '🌙' : '☀️'}
                  </Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? colors.primary : '#FFF'}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    accessibilityRole="switch"
                    accessibilityLabel={t('darkMode')}
                    accessibilityState={{ checked: isDarkMode }}
                  />
                </View>
              )
            : undefined,
          headerRight: isRTL
            ? undefined
            : () => (
                <View style={styles.darkModeRow} accessibilityRole="none">
                  <Text style={dynamicStyles.darkModeIcon}>
                    {isDarkMode ? '🌙' : '☀️'}
                  </Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? colors.primary : '#FFF'}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    accessibilityRole="switch"
                    accessibilityLabel={t('darkMode')}
                    accessibilityState={{ checked: isDarkMode }}
                  />
                </View>
              ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
  },
  darkModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
