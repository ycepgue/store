import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    product: { findUnique: jest.Mock };
    orderItem: { count: jest.Mock };
    user: { findUnique: jest.Mock };
    review: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      product: { findUnique: jest.fn() },
      orderItem: { count: jest.fn() },
      user: { findUnique: jest.fn() },
      review: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  it('создаёт отзыв, если пользователь заказывал товар (автор из аккаунта)', async () => {
    const now = new Date();
    prisma.product.findUnique.mockResolvedValue({ id: 1, name: 'Товар' });
    prisma.orderItem.count.mockResolvedValue(2);
    prisma.user.findUnique.mockResolvedValue({
      id: 7,
      email: 'anna@example.com',
      name: 'Анна',
    });
    prisma.review.create.mockResolvedValue({
      id: 10,
      productId: 1,
      rating: 5,
      comment: 'Отлично',
      author: 'Анна',
      createdAt: now,
    });

    const result = await service.create(
      { productId: 1, rating: 5, comment: 'Отлично' },
      7,
    );

    expect(prisma.orderItem.count).toHaveBeenCalledWith({
      where: { productId: 1, order: { userId: 7 } },
    });
    // автор взят из аккаунта, а не из тела запроса
    expect(prisma.review.create.mock.calls[0][0].data.author).toBe('Анна');
    expect(result.author).toBe('Анна');
  });

  it('бросает Forbidden, если пользователь не заказывал товар', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 1, name: 'Товар' });
    prisma.orderItem.count.mockResolvedValue(0);

    await expect(
      service.create({ productId: 1, rating: 4 }, 7),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('откатывается на email, если у пользователя нет имени', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 1, name: 'Товар' });
    prisma.orderItem.count.mockResolvedValue(1);
    prisma.user.findUnique.mockResolvedValue({
      id: 7,
      email: 'ivan@example.com',
      name: null,
    });
    prisma.review.create.mockResolvedValue({
      id: 11,
      productId: 1,
      rating: 4,
      comment: null,
      author: 'ivan@example.com',
      createdAt: new Date(),
    });

    await service.create({ productId: 1, rating: 4 }, 7);

    expect(prisma.review.create.mock.calls[0][0].data.author).toBe(
      'ivan@example.com',
    );
  });

  it('бросает NotFound, если товара нет', async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ productId: 999, rating: 4 }, 7),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.orderItem.count).not.toHaveBeenCalled();
  });
});
