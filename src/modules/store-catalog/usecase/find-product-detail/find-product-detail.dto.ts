export interface FindProductDetailInputDto {
  productId: string;
}

export interface FindProductDetailOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
