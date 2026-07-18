import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let tx: {
    product: { findUnique: jest.Mock; update: jest.Mock };
    order: { create: jest.Mock };
  };
  let prisma: {
    $transaction: jest.Mock;
    order: { findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    tx = {
      product: { findUnique: jest.fn(), update: jest.fn() },
      order: { create: jest.fn() },
    };
    prisma = {
      // Прогоняем колбэк транзакции с мок-объектом tx.
      $transaction: jest.fn((cb: (t: typeof tx) => unknown) => cb(tx)),
      order: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(OrdersService);
  });

  const dto = {
    customerName: 'Иван',
    customerEmail: 'ivan@example.com',
    address: 'ул. Тест, 1',
    items: [{ productId: 1, quantity: 2 }],
  };

  it('считает total, списывает сток и создаёт заказ', async () => {
    tx.product.findUnique.mockResolvedValue({
      id: 1,
      name: 'Товар',
      price: 150,
      stock: 10,
    });
    tx.order.create.mockResolvedValue({
      id: 55,
      ...dto,
      phone: null,
      latitude: null,
      longitude: null,
      deliveryDate: null,
      deliverySlot: null,
      comment: null,
      total: 300,
      status: 'pending',
      createdAt: new Date(),
      items: [
        { id: 1, productId: 1, quantity: 2, price: 150, product: { name: 'Товар' } },
      ],
    });

    const result = await service.create(dto, 7);

    expect(tx.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { stock: { decrement: 2 } },
    });
    // total = price(150) * qty(2)
    expect(tx.order.create.mock.calls[0][0].data.total).toBe(300);
    expect(result.id).toBe(55);
    expect(result.items[0].productName).toBe('Товар');
  });

  it('бросает NotFound, если товара нет', async () => {
    tx.product.findUnique.mockResolvedValue(null);

    await expect(service.create(dto, 7)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it('бросает BadRequest при нехватке стока', async () => {
    tx.product.findUnique.mockResolvedValue({
      id: 1,
      name: 'Товар',
      price: 150,
      stock: 1,
    });

    await expect(service.create(dto, 7)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it('findMine возвращает заказы пользователя', async () => {
    prisma.order.findMany.mockResolvedValue([
      {
        id: 1,
        customerName: 'Иван',
        customerEmail: 'ivan@example.com',
        phone: null,
        address: 'ул. Тест, 1',
        latitude: null,
        longitude: null,
        deliveryDate: null,
        deliverySlot: null,
        comment: null,
        total: 300,
        status: 'pending',
        createdAt: new Date(),
        items: [],
      },
    ]);

    const result = await service.findMine(7);

    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 7 } }),
    );
    expect(result).toHaveLength(1);
  });

  describe('updateStatus', () => {
    const orderRow = {
      id: 1,
      customerName: 'Иван',
      customerEmail: 'ivan@example.com',
      phone: null,
      address: 'ул. Тест, 1',
      latitude: null,
      longitude: null,
      deliveryDate: null,
      deliverySlot: null,
      comment: null,
      total: 300,
      status: 'pending',
      createdAt: new Date(),
      items: [],
    };

    it('меняет статус существующего заказа', async () => {
      prisma.order.findUnique.mockResolvedValue(orderRow);
      prisma.order.update.mockResolvedValue({ ...orderRow, status: 'shipped' });

      const result = await service.updateStatus(1, 'shipped');

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { status: 'shipped' },
        }),
      );
      expect(result.status).toBe('shipped');
    });

    it('бросает NotFound для несуществующего заказа', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus(404, 'shipped')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.order.update).not.toHaveBeenCalled();
    });
  });
});
