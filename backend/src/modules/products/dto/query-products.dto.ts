import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const SORT_FIELDS = ['price', 'name', 'createdAt'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

export class QueryProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(SORT_FIELDS)
  sortBy?: 'price' | 'name' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(SORT_ORDERS)
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
