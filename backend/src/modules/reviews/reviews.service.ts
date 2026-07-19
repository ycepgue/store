import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateReviewDto,
    userId: number,
  ): Promise<ReviewResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    // Отзыв можно оставить только на товар, который пользователь ранее заказывал.
    const orderedCount = await this.prisma.orderItem.count({
      where: {
        productId: dto.productId,
        order: { userId },
      },
    });

    if (orderedCount === 0) {
      throw new ForbiddenException(
        'Оставить отзыв можно только на заказанный ранее товар',
      );
    }

    // Автор берётся из аккаунта, а не из тела запроса.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const author = user?.name?.trim() || user?.email || 'Покупатель';

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
        author,
      },
    });

    return {
      id: review.id,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      author: review.author,
      createdAt: review.createdAt,
    };
  }
}
