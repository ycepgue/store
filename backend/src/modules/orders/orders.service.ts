import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    // Validate all products and calculate total
    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData: {
        productId: number;
        quantity: number;
        price: number;
        productName: string;
      }[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          );
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          productName: product.name,
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          phone: dto.phone,
          address: dto.address,
          total,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      return createdOrder;
    });

    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      address: order.address,
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
