import { IsIn } from 'class-validator';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  status: OrderStatus;
}
