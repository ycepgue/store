import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: { id: number },
  ): Promise<OrderResponseDto> {
    return this.ordersService.create(dto, user.id);
  }

  @Get()
  findMine(@CurrentUser() user: { id: number }): Promise<OrderResponseDto[]> {
    return this.ordersService.findMine(user.id);
  }
}
