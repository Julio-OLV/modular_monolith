export default class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client not found with id ${id}`);
    this.name = "ClientNotFoundError";
  }
}
