export interface CategoryBrief {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string
  createdAt: string
}
