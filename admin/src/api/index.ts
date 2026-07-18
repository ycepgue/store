import { apiFetch } from './client'
import type {
  AuthResponse,
  Category,
  CategoryInput,
  Order,
  PaginatedProducts,
  Product,
  ProductInput,
} from '@/types'

// --- Auth ---
export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}

// --- Products ---
export function fetchProducts(): Promise<PaginatedProducts> {
  return apiFetch<PaginatedProducts>(
    '/products?limit=100&sortBy=createdAt&sortOrder=desc',
    { auth: false },
  )
}

export function createProduct(payload: ProductInput): Promise<Product> {
  return apiFetch<Product>('/products', { method: 'POST', body: payload })
}

export function updateProduct(
  id: number,
  payload: Partial<ProductInput>,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: payload })
}

export function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/products/${id}`, { method: 'DELETE' })
}

// --- Categories ---
export function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories', { auth: false })
}

export function createCategory(payload: CategoryInput): Promise<Category> {
  return apiFetch<Category>('/categories', { method: 'POST', body: payload })
}

export function updateCategory(
  id: number,
  payload: Partial<CategoryInput>,
): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' })
}

// --- Orders ---
export function fetchAllOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders/all')
}

export function updateOrderStatus(id: number, status: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}
