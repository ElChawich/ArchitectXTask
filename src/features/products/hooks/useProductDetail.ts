import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../../../api/products';
import type { Product } from '../../../api/types';

interface UseProductDetailReturn {
  product: Product | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

function useProductDetail(id: number): UseProductDetailReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    product: data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}

export default useProductDetail;
