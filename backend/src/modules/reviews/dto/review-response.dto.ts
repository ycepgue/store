export class ReviewResponseDto {
  id: number;
  productId: number;
  rating: number;
  comment: string | null;
  author: string;
  createdAt: Date;
}
