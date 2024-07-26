export interface FindProductDetailInputDto {
  id: string;
}

export interface FindProductDetailOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
