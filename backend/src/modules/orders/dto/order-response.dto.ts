export class OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export class OrderResponseDto {
  id: number;
  customerName: string;
  customerEmail: string;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  deliveryDate: string | null;
  deliverySlot: string | null;
  comment: string | null;
  total: number;
  status: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
}
