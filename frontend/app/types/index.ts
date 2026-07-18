export interface CategoryBrief {
  id: number
  name: string
  slug: string
}

export interface Review {
  id: number
  rating: number
  comment: string | null
  author: string
  createdAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  images: string[]
  stock: number
  categoryId: number
  category?: CategoryBrief
  reviews?: Review[]
  createdAt: string
}

export interface CreateReviewPayload {
  productId: number
  rating: number
  comment?: string
}

export interface PaginatedProducts {
  items: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
}

export interface ProductsQuery {
  categoryId?: number
  search?: string
  sortBy?: 'price' | 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  phone: string | null
  address: string
  latitude: number | null
  longitude: number | null
  deliveryDate: string | null
  deliverySlot: string | null
  comment: string | null
  total: number
  status: string
  items: OrderItem[]
  createdAt: string
}

export interface CreateOrderPayload {
  customerName: string
  customerEmail: string
  phone?: string
  address: string
  latitude?: number
  longitude?: number
  deliveryDate?: string
  deliverySlot?: string
  comment?: string
  items: { productId: number; quantity: number }[]
}
