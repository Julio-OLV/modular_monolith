export interface FindProductDetailFacadeInputDto {
  id: string;
}

export interface FindProductDetailFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindAllProductsFacadeOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}

export default interface StoreCatalogFacadeInterface {
  find(
    input: FindProductDetailFacadeInputDto
  ): Promise<FindProductDetailFacadeOutputDto>;
  findAll(): Promise<FindAllProductsFacadeOutputDto>;
}
