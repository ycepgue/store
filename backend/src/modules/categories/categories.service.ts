import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/admin-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map(CategoryDto.fromEntity);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryDto> {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        icon: dto.icon || undefined,
      },
    });
    return CategoryDto.fromEntity(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryDto> {
    await this.ensureExists(id);
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        icon: dto.icon,
      },
    });
    return CategoryDto.fromEntity(category);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
  }

  private async ensureExists(id: number): Promise<void> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
