import { renderHook, act } from '@testing-library/react-native';
import useFavorites from '../src/hooks/useFavorites';
import { useFavoritesStore } from '../src/store/favoritesStore';
import type { Product } from '../src/api/types';

// Reset Zustand store before each test
beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
});

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  category: 'test',
  price: 29.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 100,
  tags: ['test'],
  brand: 'TestBrand',
  sku: 'TEST-001',
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: '1 Year',
  shippingInformation: 'Ships in 1-2 days',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30-day return',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    barcode: '123456789',
    qrCode: 'https://example.com/qr',
  },
  images: ['https://example.com/image.jpg'],
  thumbnail: 'https://example.com/thumb.jpg',
};

const mockProduct2: Product = { ...mockProduct, id: 2, title: 'Test Product 2' };

describe('useFavorites', () => {
  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toHaveLength(0);
  });

  it('isFavorite returns false for non-favorite product', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('toggleFavorite adds product to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockProduct);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(1);
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it('toggleFavorite removes product when already a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockProduct);
    });
    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.toggleFavorite(mockProduct);
    });
    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('handles multiple favorites independently', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockProduct);
      result.current.toggleFavorite(mockProduct2);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);

    act(() => {
      result.current.toggleFavorite(mockProduct);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.isFavorite(2)).toBe(true);
  });

  it('isFavorite returns false for unknown id', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(999)).toBe(false);
  });
});
