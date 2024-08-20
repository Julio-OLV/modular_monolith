export default class NoProductsSelectedError extends Error {
  constructor() {
    super(`No products selected`);
    this.name = "NoProductsSelectedError";
  }
}
