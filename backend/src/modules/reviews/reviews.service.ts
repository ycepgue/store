import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
        author: dto.author,
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
