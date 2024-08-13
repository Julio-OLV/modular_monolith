import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import ClientModel from "./client.model";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientRepository from "./client.repository";

describe("Client repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer by repository", async () => {
    const repository = new ClientRepository();
    const clientProps = {
      id: new Id(uuid()),
      name: "client name",
      email: "client@xpto.com",
      document: "0000000000",
      city: "City X",
      complement: "Complement X",
      number: "10",
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    };
    const client = new Client(clientProps);

    await repository.add(client);

    const clientInDb = await ClientModel.findOne({
      where: { id: clientProps.id.id },
    });

    expect(clientInDb).toBeDefined();
    expect(clientInDb?.dataValues.id).toEqual(client.id.id);
    expect(clientInDb?.dataValues.name).toEqual(client.name);
    expect(clientInDb?.dataValues.email).toEqual(client.email);
    expect(clientInDb?.dataValues.street).toEqual(client.street);
    expect(clientInDb?.dataValues.createdAt).toBeDefined();
    expect(clientInDb?.dataValues.updatedAt).toBeDefined();
  });

  it("should find a customer by repository", async () => {
    const repository = new ClientRepository();
    const clientProps = {
      id: "1",
      name: "client name",
      email: "client@xpto.com",
      document: "0000000000",
      city: "City X",
      complement: "Complement X",
      number: "10",
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ClientModel.create(clientProps);

    const client = await repository.find(clientProps.id);

    expect(client).toBeDefined();
    expect(client.id.id).toEqual(clientProps.id);
    expect(client.name).toEqual(clientProps.name);
    expect(client.email).toEqual(clientProps.email);
    expect(client.street).toEqual(clientProps.street);
  });
});
