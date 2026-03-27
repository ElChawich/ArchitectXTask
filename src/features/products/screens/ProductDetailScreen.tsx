import React, { useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import useProductDetail from '../hooks/useProductDetail';
import ImageGallery from '../../../components/ImageGallery';
import HeartButton from '../../../components/HeartButton';
import SkeletonCard from '../../../components/SkeletonCard';
import ErrorState from '../../../components/ErrorState';
import useFavorites from '../../../hooks/useFavorites';
import { useFavoritesStore } from '../../../store/favoritesStore';
import useDarkMode from '../../../hooks/useDarkMode';
import useLanguage from '../../../hooks/useLanguage';
import { spacing, borderRadius, fontSize } from '../../../theme/spacing';
import type { ProductDetailScreenProps } from '../../../navigation/types';

export default function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps) {
  const { id, title } = route.params;
  const { product, isLoading, isError, refetch } = useProductDetail(id);
  const { toggleFavorite } = useFavorites();
  const isFav = useFavoritesStore((state) => state.isFavorite(id));
  const { colors } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const dynamicStyles = useMemo(() => ({
    screen: { backgroundColor: colors.background } as ViewStyle,
    loadingContainer: { ...styles.loadingContainer, backgroundColor: colors.background } as ViewStyle,
    errorContainer: { ...styles.errorContainer, backgroundColor: colors.background } as ViewStyle,
    titleRow: { ...styles.titleRow, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    title: { ...styles.title, color: colors.text, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    price: { ...styles.price, color: colors.text } as TextStyle,
    discountBadge: { ...styles.discountBadge, backgroundColor: colors.error } as ViewStyle,
    metaGrid: { ...styles.metaGrid, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    description: { ...styles.description, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    infoText: { ...styles.infoText, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    reviewCard: { ...styles.reviewCard, backgroundColor: colors.card, borderColor: colors.border } as ViewStyle,
    reviewHeader: { ...styles.reviewHeader, flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    reviewerName: { ...styles.reviewerName, color: colors.text, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    reviewComment: { ...styles.reviewComment, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    star: { color: colors.star } as TextStyle,
  }), [colors, isRTL]);

  const textAlign = isRTL ? 'right' as const : 'left' as const;

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () =>
        product ? (
          <HeartButton
            product={product}
            isFav={isFav}
            onToggle={toggleFavorite}
            size={22}
          />
        ) : null,
    });
  }, [navigation, title, product, isFav, toggleFavorite, isRTL]);

  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  return (
    <ScrollView
      style={dynamicStyles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessibilityRole="scrollbar"
    >
      <ImageGallery images={product.images} title={product.title} />

      <View style={styles.body}>
        {/* Title & Heart */}
        <View style={dynamicStyles.titleRow}>
          <Text style={dynamicStyles.title} accessibilityRole="header">
            {product.title}
          </Text>
          <HeartButton
            product={product}
            isFav={isFav}
            onToggle={toggleFavorite}
            size={26}
          />
        </View>

        {/* Price row — always LTR */}
        <View style={styles.priceRow}>
          <Text style={dynamicStyles.price}>
            ${product.price.toFixed(2)}
          </Text>
          {product.discountPercentage > 0 && (
            <View style={dynamicStyles.discountBadge}>
              <Text style={styles.discountText}>-{product.discountPercentage.toFixed(0)}%</Text>
            </View>
          )}
        </View>

        {/* Meta grid */}
        <View style={dynamicStyles.metaGrid}>
          <MetaItem
            label={t('product.rating')}
            value={`★ ${product.rating.toFixed(1)}`}
            valueColor={colors.star}
            textAlign={textAlign}
            colors={colors}
          />
          <MetaItem
            label={t('product.stock')}
            value={String(product.stock)}
            valueColor={product.stock > 0 ? colors.success : colors.error}
            textAlign={textAlign}
            colors={colors}
          />
          {product.brand && (
            <MetaItem
              label={t('product.brand')}
              value={product.brand}
              textAlign={textAlign}
              colors={colors}
            />
          )}
          <MetaItem
            label={t('product.category')}
            value={product.category}
            textAlign={textAlign}
            colors={colors}
          />
        </View>

        {/* Description */}
        <SectionTitle title={t('product.description')} colors={colors} isRTL={isRTL} />
        <Text style={dynamicStyles.description}>
          {product.description}
        </Text>

        {/* Availability */}
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor:
                product.availabilityStatus === 'In Stock'
                  ? colors.success + '20'
                  : colors.error + '20',
            },
          ]}
          accessibilityRole="text"
          accessibilityLabel={t('accessibility.availability', {
            status: product.availabilityStatus === 'In Stock'
              ? t('product.inStock')
              : t('product.outOfStock'),
          })}
        >
          <Text
            style={[
              styles.availabilityText,
              {
                color:
                  product.availabilityStatus === 'In Stock'
                    ? colors.success
                    : colors.error,
              },
            ]}
          >
            {product.availabilityStatus === 'In Stock'
              ? t('product.inStock')
              : t('product.outOfStock')}
          </Text>
        </View>

        {/* Warranty & Shipping */}
        <SectionTitle title={t('product.warranty')} colors={colors} isRTL={isRTL} />
        <Text style={dynamicStyles.infoText}>
          {product.warrantyInformation}
        </Text>

        <SectionTitle title={t('product.shipping')} colors={colors} isRTL={isRTL} />
        <Text style={dynamicStyles.infoText}>
          {product.shippingInformation}
        </Text>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <>
            <SectionTitle title={t('product.reviews')} colors={colors} isRTL={isRTL} />
            {product.reviews.map((review, index) => (
              <View
                key={index}
                style={dynamicStyles.reviewCard}
                accessibilityRole="text"
              >
                <View style={dynamicStyles.reviewHeader}>
                  <Text style={dynamicStyles.reviewerName}>
                    {review.reviewerName}
                  </Text>
                  {/* rating always LTR */}
                  <Text style={dynamicStyles.star}>{'★'.repeat(review.rating)}</Text>
                </View>
                <Text style={dynamicStyles.reviewComment}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

interface MetaItemProps {
  label: string;
  value: string;
  valueColor?: string;
  textAlign: 'left' | 'right';
  colors: ReturnType<typeof useDarkMode>['colors'];
}

function MetaItem({ label, value, valueColor, textAlign, colors }: MetaItemProps) {
  const dynamicStyles = useMemo(() => ({
    item: { ...metaStyles.item, backgroundColor: colors.card, borderColor: colors.border } as ViewStyle,
    label: { ...metaStyles.label, color: colors.textSecondary, textAlign } as TextStyle,
    value: { ...metaStyles.value, color: valueColor ?? colors.text, textAlign } as TextStyle,
  }), [colors, textAlign, valueColor]);

  return (
    <View style={dynamicStyles.item}>
      <Text style={dynamicStyles.label}>{label}</Text>
      <Text style={dynamicStyles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

interface SectionTitleProps {
  title: string;
  colors: ReturnType<typeof useDarkMode>['colors'];
  isRTL: boolean;
}

function SectionTitle({ title, colors, isRTL }: SectionTitleProps) {
  const dynamicStyles = useMemo(() => ({
    text: { ...styles.sectionTitle, color: colors.text, textAlign: isRTL ? 'right' : 'left' } as TextStyle,
  }), [colors, isRTL]);

  return (
    <Text style={dynamicStyles.text} accessibilityRole="header">
      {title}
    </Text>
  );
}

const metaStyles = StyleSheet.create({
  item: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    margin: spacing.xs / 2,
    minWidth: '30%',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: spacing.md,
  },
  errorContainer: {
    flex: 1,
    padding: spacing.md,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  body: {
    padding: spacing.md,
  },
  titleRow: {
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 28,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  discountBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  metaGrid: {
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  availabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  availabilityText: {
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  reviewCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reviewerName: {
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  reviewComment: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});
