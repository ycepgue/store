import { Category } from '@prisma/client';

export class CategoryDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  createdAt: Date;

  static fromEntity(entity: Category): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      icon: entity.icon,
      createdAt: entity.createdAt,
    };
  }
}
