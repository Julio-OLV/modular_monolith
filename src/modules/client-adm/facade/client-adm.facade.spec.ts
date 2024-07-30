import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import FacadeFactory from "../factory/facade.factory";

describe("ClientAdmFacade test", () => {
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

  it("should create a client", async () => {
    const facade = FacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "Email 1",
      address: "Address 1",
    };

    await facade.add(input);

    const clientInDb = await ClientModel.findOne({ where: { id: input.id } });

    expect(clientInDb?.dataValues.id).toEqual(input.id);
    expect(clientInDb?.dataValues.name).toEqual(input.name);
    expect(clientInDb?.dataValues.email).toEqual(input.email);
    expect(clientInDb?.dataValues.address).toEqual(input.address);
  });

  it("should find a client", async () => {
    const facade = FacadeFactory.create();

    const clientProps = {
      id: "1",
      name: "client name",
      email: "client@xpto.com",
      address: "address",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ClientModel.create(clientProps);

    const clientInDb = await facade.find({ id: clientProps.id });

    expect(clientInDb.id).toEqual(clientProps.id);
    expect(clientInDb.name).toEqual(clientProps.name);
    expect(clientInDb.email).toEqual(clientProps.email);
    expect(clientInDb.address).toEqual(clientProps.address);
  });
});
