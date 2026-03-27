import request from './client';
import type { Product, ProductsResponse, Category } from './types';

const LIMIT = 20;

export const fetchProducts = (skip: number): Promise<ProductsResponse> =>
  request<ProductsResponse>(`/products?limit=${LIMIT}&skip=${skip}`);

export const fetchProductsByCategory = (category: string, skip: number): Promise<ProductsResponse> =>
  request<ProductsResponse>(`/products/category/${category}?limit=${LIMIT}&skip=${skip}`);

export const fetchProductsBySearch = (query: string, skip: number): Promise<ProductsResponse> =>
  request<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}&limit=${LIMIT}&skip=${skip}`);

export const fetchProductById = (id: number): Promise<Product> =>
  request<Product>(`/products/${id}`);

export const fetchCategories = (): Promise<Category[]> =>
  request<Category[]>('/products/categories');
