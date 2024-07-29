export interface AddClientInputDto {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface AddClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  updatedAt: Date;
  createdAt: Date;
}
