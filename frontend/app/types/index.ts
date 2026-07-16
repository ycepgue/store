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
