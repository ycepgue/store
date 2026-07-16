import { Product, Category, Review } from '@prisma/client';

class CategoryBriefDto {
  id: number;
  name: string;
  slug: string;
}

class ReviewBriefDto {
  id: number;
  rating: number;
  comment: string | null;
  author: string;
  createdAt: Date;
}

export class ProductDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  stock: number;
  categoryId: number;
  category?: CategoryBriefDto;
  reviews?: ReviewBriefDto[];
  createdAt: Date;

  static fromEntity(
    entity: Product & { category?: Category; reviews?: Review[] },
  ): ProductDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      price: entity.price,
      images: this.parseImages(entity.images),
      stock: entity.stock,
      categoryId: entity.categoryId,
      category: entity.category
        ? { id: entity.category.id, name: entity.category.name, slug: entity.category.slug }
        : undefined,
      reviews: entity.reviews
        ? entity.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            author: r.author,
            createdAt: r.createdAt,
          }))
        : undefined,
      createdAt: entity.createdAt,
    };
  }

  private static parseImages(images: string | null): string[] {
    if (!images) return [];
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
}

export class PaginatedProductsDto {
  items: ProductDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
