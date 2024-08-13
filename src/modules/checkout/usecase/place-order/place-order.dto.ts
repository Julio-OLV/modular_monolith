export interface PlaceOrderUsecaseInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderUsecaseOutputDto {
  id: string;
  invoiceId?: string | null | undefined;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}
