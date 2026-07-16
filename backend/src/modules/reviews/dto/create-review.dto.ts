import { IsInt, IsString, IsOptional, Min, Max, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;
}
