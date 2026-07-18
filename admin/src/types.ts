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

export interface CategoryBrief {
  id: number
  name: string
  slug: string
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
  createdAt: string
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
  icon: string
  createdAt: string
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
  deliveryDate: string | null
  deliverySlot: string | null
  comment: string | null
  total: number
  status: string
  items: OrderItem[]
  createdAt: string
}

export interface ProductInput {
  name: string
  slug: string
  description?: string
  price: number
  images?: string[]
  stock?: number
  categoryId: number
}

export interface CategoryInput {
  name: string
  slug: string
  description?: string
  icon?: string
}
