export interface ProductDto {
  name: string
  slug: string
  description?: string
  price: number
  images?: string[]
  stock?: number
  categoryId: number
}
