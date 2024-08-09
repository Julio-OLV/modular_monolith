export interface PlaceOrderUsecaseInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderUsecaseOutputDto {
  id: string;
  total: number;
  products: {
    productId: string;
  }[];
}
