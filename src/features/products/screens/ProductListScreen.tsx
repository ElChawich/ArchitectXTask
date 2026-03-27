import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../../../components/ProductCard';
import SkeletonCard from '../../../components/SkeletonCard';
import ErrorState from '../../../components/ErrorState';
import useProducts from '../hooks/useProducts';
import useDebounce from '../../../hooks/useDebounce';
import useFavorites from '../../../hooks/useFavorites';
import useDarkMode from '../../../hooks/useDarkMode';
import useLanguage from '../../../hooks/useLanguage';
import { Direction } from '../../../constants/layout';
import { fetchCategories } from '../../../api/products';
import { spacing, borderRadius, fontSize } from '../../../theme/spacing';
import type { ProductListScreenProps } from '../../../navigation/types';
import type { Product, Category } from '../../../api/types';

const SKELETON_COUNT = 3;

export default function ProductListScreen({ navigation }: ProductListScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const debouncedSearch = useDebounce(searchText, 300);
  const { colors } = useDarkMode();
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { products, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts({ search: debouncedSearch, category: selectedCategory });

  const { data: categories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000,
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('screens.products') });
  }, [navigation, t]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { id: product.id, title: product.title });
    },
    [navigation],
  );

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategory((prev) => (prev === slug ? '' : slug));
    setSearchText('');
  }, []);

  const renderProduct = useCallback(
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

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <ActivityIndicator
        color={colors.primary}
        style={styles.footerSpinner}
        accessibilityLabel={t('loading')}
      />
    );
  }, [isFetchingNextPage, colors.primary, t]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const dynamicStyles = useMemo(() => ({
    container: { ...styles.container, backgroundColor: colors.background } as ViewStyle,
    searchRow: { ...styles.searchRow, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    searchInput: {
      ...styles.searchInput,
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.text,
      textAlign: isRTL ? 'right' : 'left',
    } as TextStyle,
    langButton: { ...styles.langButton, backgroundColor: colors.primaryLight } as ViewStyle,
    langButtonText: { ...styles.langButtonText, color: colors.primary } as TextStyle,
    categoryLabel: {
      ...styles.categoryLabel,
      color: colors.textSecondary,
      textAlign: isRTL ? 'right' : 'left',
    } as TextStyle,
    categoryScrollView: { direction: isRTL ? Direction.RTL : Direction.LTR } as ViewStyle,
    emptyText: { ...styles.emptyText, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
  }), [colors, isRTL]);

  // Per-chip styles depend on selectedCategory — computed per item, not memoizable
  const chipStyle = (selected: boolean): ViewStyle => ({
    ...styles.categoryChip,
    backgroundColor: selected ? colors.primary : colors.card,
    borderColor: selected ? colors.primary : colors.border,
  });
  const chipTextStyle = (selected: boolean): TextStyle => ({
    ...styles.categoryChipText,
    color: selected ? '#FFF' : colors.text,
  });

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(18)}
      style={dynamicStyles.container}
    >
      {/* Search + Language Toggle Row */}
      <View style={dynamicStyles.searchRow}>
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          accessibilityLabel={t('search.placeholder')}
          accessibilityRole="search"
        />
        <Pressable
          style={dynamicStyles.langButton}
          onPress={toggleLanguage}
          accessibilityRole="button"
          accessibilityLabel={t('language')}
          accessibilityHint={t('accessibility.languageToggleHint')}
        >
          <Text style={dynamicStyles.langButtonText}>
            {language === 'en' ? 'AR' : 'EN'}
          </Text>
        </Pressable>
      </View>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <View style={styles.categorySection}>
          <Text style={dynamicStyles.categoryLabel}>
            {t('category.label')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={dynamicStyles.categoryScrollView}
            contentContainerStyle={styles.categoryScroll}
            accessibilityRole="scrollbar"
            accessibilityLabel={`${t('category.label')} filter`}
          >
            <Pressable
              style={chipStyle(selectedCategory === '')}
              onPress={() => handleCategorySelect('')}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === '' }}
              accessibilityLabel={t('category.all')}
            >
              <Text style={chipTextStyle(selectedCategory === '')}>
                {t('category.all')}
              </Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat.slug}
                style={chipStyle(selectedCategory === cat.slug)}
                onPress={() => handleCategorySelect(cat.slug)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedCategory === cat.slug }}
                accessibilityLabel={cat.name}
              >
                <Text
                  style={chipTextStyle(selectedCategory === cat.slug)}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <FlatList
          data={Array.from({ length: SKELETON_COUNT }, (_, i) => i)}
          keyExtractor={(item) => `skeleton-${item}`}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          initialNumToRender={SKELETON_COUNT}
          accessibilityLabel={t('loading')}
        />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={dynamicStyles.emptyText}>
              No products found.
            </Text>
          }
          showsVerticalScrollIndicator={false}
          // Performance optimisations
          removeClippedSubviews
          initialNumToRender={4}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={30}
          windowSize={2}
          accessibilityRole="list"
          accessibilityLabel={t('accessibility.productList')}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    height: 44,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    fontSize: fontSize.md,
    flex: 1,
  },
  langButton: {
    height: 44,
    width: 54,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonText: {
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  categorySection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  categoryScroll: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    maxWidth: 120,
  },
  categoryChipText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  footerSpinner: {
    marginVertical: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontSize: fontSize.md,
  },
});
