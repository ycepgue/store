import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus } from './dto/update-order-status.dto';

type OrderWithItems = {
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
  createdAt: Date;
  items: {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: { name: string };
  }[];
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: number): Promise<OrderResponseDto> {
    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData: {
        productId: number;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          );
        }

        total += product.price * item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      return tx.order.create({
        data: {
          userId,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          phone: dto.phone,
          address: dto.address,
          latitude: dto.latitude,
          longitude: dto.longitude,
          deliveryDate: dto.deliveryDate,
          deliverySlot: dto.deliverySlot,
          comment: dto.comment,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });
    }, {
      // The database may be remote (higher latency), so allow more time to
      // acquire and run the transaction than Prisma's 2s/5s defaults.
      maxWait: 15000,
      timeout: 30000,
    });

    return this.toResponse(order);
  }

  async findMine(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    return orders.map((order) => this.toResponse(order));
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    return orders.map((order) => this.toResponse(order));
  }

  async updateStatus(
    id: number,
    status: OrderStatus,
  ): Promise<OrderResponseDto> {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
    return this.toResponse(order);
  }

  private toResponse(order: OrderWithItems): OrderResponseDto {
    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      address: order.address,
      latitude: order.latitude,
      longitude: order.longitude,
      deliveryDate: order.deliveryDate,
      deliverySlot: order.deliverySlot,
      comment: order.comment,
      total: order.total,
      status: order.status,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt,
    };
  }
}
