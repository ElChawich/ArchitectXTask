import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductsByCategory, fetchProductsBySearch } from '../../../api/products';
import type { Product, ProductsResponse } from '../../../api/types';

const LIMIT = 20;

interface UseProductsParams {
  search?: string;
  category?: string;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

function useProducts({ search = '', category = '' }: UseProductsParams = {}): UseProductsReturn {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<ProductsResponse, Error>({
      queryKey: ['products', search, category],
      queryFn: ({ pageParam }) => {
        const skip = (pageParam as number) * LIMIT;
        if (search.trim()) {
          return fetchProductsBySearch(search.trim(), skip);
        }
        if (category) {
          return fetchProductsByCategory(category, skip);
        }
        return fetchProducts(skip);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        const fetched = pages.length * LIMIT;
        return fetched < lastPage.total ? pages.length : undefined;
      },
    });

  return {
    products: data?.pages.flatMap((p) => p.products) ?? [],
    isLoading,
    isError,
    error: error ?? null,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    refetch,
  };
}

export default useProducts;
