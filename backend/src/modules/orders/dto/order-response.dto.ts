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
  total: number;
  status: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
}
