import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const baseProduct = {
    id: 1,
    name: 'Товар',
    slug: 'tovar',
    description: null,
    price: 100,
    images: '["a.jpg"]',
    stock: 5,
    categoryId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      // Сервис вызывает $transaction с массивом промисов.
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('findAll', () => {
    it('возвращает пагинацию и парсит images в массив', async () => {
      prisma.product.findMany.mockResolvedValue([baseProduct]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].images).toEqual(['a.jpg']);
    });

    it('применяет фильтр по категории и поиску', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ categoryId: 2, search: 'фен' });

      const args = prisma.product.findMany.mock.calls[0][0];
      expect(args.where.categoryId).toBe(2);
      expect(args.where.name).toEqual({ contains: 'фен', mode: 'insensitive' });
    });
  });

  describe('findOne', () => {
    it('возвращает товар с отзывами', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...baseProduct,
        reviews: [
          { id: 1, rating: 5, comment: null, author: 'A', createdAt: new Date() },
        ],
      });

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.reviews).toHaveLength(1);
    });

    it('бросает NotFound для несуществующего id', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(404)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('сериализует images в JSON-строку', async () => {
      prisma.product.create.mockResolvedValue({ ...baseProduct, images: '["x.jpg"]' });

      await service.create({
        name: 'Товар',
        slug: 'tovar',
        price: 100,
        categoryId: 2,
        images: ['x.jpg'],
      });

      const data = prisma.product.create.mock.calls[0][0].data;
      expect(data.images).toBe('["x.jpg"]');
      expect(data.stock).toBe(0);
    });
  });

  describe('update', () => {
    it('обновляет существующий товар', async () => {
      prisma.product.findUnique.mockResolvedValue(baseProduct);
      prisma.product.update.mockResolvedValue({ ...baseProduct, price: 200 });

      const result = await service.update(1, { price: 200 });

      expect(result.price).toBe(200);
      // images не переданы — не должны перезаписываться
      expect(prisma.product.update.mock.calls[0][0].data.images).toBeUndefined();
    });

    it('бросает NotFound, если товара нет', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.update(404, { price: 1 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('удаляет существующий товар', async () => {
      prisma.product.findUnique.mockResolvedValue(baseProduct);
      prisma.product.delete.mockResolvedValue(baseProduct);

      await service.remove(1);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('бросает NotFound, если товара нет', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.remove(404)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
