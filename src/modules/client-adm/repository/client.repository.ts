import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientNotFoundError from "../error/client-not-found.error";
import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      city: client.city,
      complement: client.complement,
      document: client.document,
      number: client.number,
      state: client.state,
      street: client.street,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }

  async find(id: string): Promise<Client> {
    const clientInDb = await ClientModel.findOne({ where: { id } });

    if (!clientInDb) {
      throw new ClientNotFoundError(id);
    }

    return new Client({
      id: new Id(clientInDb.dataValues.id),
      name: clientInDb.dataValues.name,
      email: clientInDb.dataValues.email,
      city: clientInDb.dataValues.city,
      complement: clientInDb.dataValues.complement,
      document: clientInDb.dataValues.document,
      number: clientInDb.dataValues.number,
      state: clientInDb.dataValues.state,
      street: clientInDb.dataValues.street,
      zipCode: clientInDb.dataValues.zipCode,
      createdAt: clientInDb.dataValues.createdAt,
      updatedAt: clientInDb.dataValues.updatedAt,
    });
  }
}
