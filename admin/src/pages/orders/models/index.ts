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
