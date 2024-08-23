export default class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product not found with id ${id}`);
    this.name = "ProductNotFoundError";
  }
}
