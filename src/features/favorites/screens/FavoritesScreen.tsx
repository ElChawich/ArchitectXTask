import React, { useCallback, useMemo } from 'react';
import { FlatList, View, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../../../components/ProductCard';
import EmptyState from '../../../components/EmptyState';
import { useTranslation } from 'react-i18next';
import useFavorites from '../../../hooks/useFavorites';
import useDarkMode from '../../../hooks/useDarkMode';
import { spacing } from '../../../theme/spacing';
import type { Product } from '../../../api/types';
import type { ProductListNavigationProp } from '../../../navigation/types';

export default function FavoritesScreen() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { colors } = useDarkMode();
  const { t } = useTranslation();
  const navigation = useNavigation<ProductListNavigationProp>();

  const dynamicStyles = useMemo(() => ({
    container: { ...styles.container, backgroundColor: colors.background } as ViewStyle,
  }), [colors]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductsTab', {
        screen: 'ProductDetail',
        params: { id: product.id, title: product.title },
      } as never);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={handleProductPress}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [handleProductPress, isFavorite, toggleFavorite],
  );

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        // Performance optimisations
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={30}
        windowSize={5}
        accessibilityRole="list"
        accessibilityLabel={t('accessibility.favoritesList')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flex: 1,
  },
});
