import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { ProductDto, PaginatedProductsDto } from './dto/product.dto';
import { CreateProductDto, UpdateProductDto } from './dto/admin-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedProductsDto> {
    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (query.sortBy === 'price') orderBy.price = query.sortOrder;
    else if (query.sortBy === 'name') orderBy.name = query.sortOrder;
    else orderBy.createdAt = query.sortOrder;

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((item) => ProductDto.fromEntity(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return ProductDto.fromEntity(product);
  }

  async create(dto: CreateProductDto): Promise<ProductDto> {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        images: JSON.stringify(dto.images ?? []),
        stock: dto.stock ?? 0,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
    return ProductDto.fromEntity(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductDto> {
    await this.ensureExists(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        images: dto.images !== undefined ? JSON.stringify(dto.images) : undefined,
        stock: dto.stock,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
    return ProductDto.fromEntity(product);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.product.delete({ where: { id } });
  }

  private async ensureExists(id: number): Promise<void> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
