import React, { Activity, useState, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  Pressable,
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
import { Direction, Language } from '../../../constants/layout';
import { fetchCategories } from '../../../api/products';
import { spacing, borderRadius, fontSize } from '../../../theme/spacing';
import type { ProductListScreenProps } from '../../../navigation/types';
import type { Product, Category } from '../../../api/types';

const SKELETON_COUNT = 3;

export default function ProductListScreen({ navigation }: ProductListScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const listRef = useRef<FlatList<Product>>(null);
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
    if (selectedCategory === slug) return;
    setSelectedCategory(slug);
    setSearchText('');
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [selectedCategory]);

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
    chipSelected: { ...styles.categoryChip, backgroundColor: colors.primary, borderColor: colors.primary } as ViewStyle,
    chipUnselected: { ...styles.categoryChip, backgroundColor: colors.card, borderColor: colors.border } as ViewStyle,
    chipTextSelected: { ...styles.categoryChipText, color: '#FFF' } as TextStyle,
    chipTextUnselected: { ...styles.categoryChipText, color: colors.text } as TextStyle,
  }), [colors, isRTL]);

  const categoryData = useMemo<Category[]>(
    () => [{ slug: '', name: t('category.all'), url: '' }, ...(categories ?? [])],
    [categories, t],
  );

  const renderCategoryChip = useCallback(
    ({ item }: { item: Category }) => {
      const isSelected = selectedCategory === item.slug;
      return (
        <Pressable
          style={isSelected ? dynamicStyles.chipSelected : dynamicStyles.chipUnselected}
          onPress={() => handleCategorySelect(item.slug)}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={item.name}
        >
          <Text
            style={isSelected ? dynamicStyles.chipTextSelected : dynamicStyles.chipTextUnselected}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [selectedCategory, dynamicStyles, handleCategorySelect],
  );

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
            {language === Language.EN ? 'AR' : 'EN'}
          </Text>
        </Pressable>
      </View>

      {/* Category Filter — pre-rendered in background; flips visible once categories load */}
      <Activity mode={categories && categories.length > 0 ? 'visible' : 'hidden'}>
        <View style={styles.categorySection}>
          <Text style={dynamicStyles.categoryLabel}>
            {t('category.label')}
          </Text>
          <FlatList
            horizontal
            data={categoryData}
            keyExtractor={(item) => item.slug || '__all__'}
            renderItem={renderCategoryChip}
            showsHorizontalScrollIndicator={false}
            style={dynamicStyles.categoryScrollView}
            contentContainerStyle={styles.categoryScroll}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={3}
            removeClippedSubviews
            accessibilityRole="list"
            accessibilityLabel={`${t('category.label')} filter`}
          />
        </View>
      </Activity>

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
          ref={listRef}
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={dynamicStyles.emptyText}>
              {t('products.empty')}
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
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  categoryScroll: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.md,
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
