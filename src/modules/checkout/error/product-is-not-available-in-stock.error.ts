export default class ProductIsNotAvailableInStockError extends Error {
  constructor(id: string) {
    super(`Product ${id} is not available in stock`);
    this.name = "ProductIsNotAvailableInStockError";
  }
}
