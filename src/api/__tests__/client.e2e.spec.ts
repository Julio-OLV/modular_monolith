import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request = require("supertest");
import { StatusCodes } from "http-status-codes";
import ClientModel from "../../modules/client-adm/repository/client.model";
import { migrator } from "../../infrastructure/sequelize/config-migrations/migrator";
import { app } from "../express";
import { AddClientInputDto } from "../../modules/client-adm/usecase/add-client/add-client.usecase.dto";

describe("E2E Client tests", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: false },
      models: [ClientModel],
    });

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!sequelize || !migration) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a new client", async () => {
    const result = await request(app)
      .post("/clients")
      .set("Accept", "application/json")
      .send({
        city: "City X",
        complement: "Complement X",
        document: "00000000000",
        email: "email@test.com",
        name: "Name X",
        number: "123",
        state: "State X",
        street: "Street X",
        zipCode: "00000000",
      } satisfies AddClientInputDto);

    expect(result.statusCode).toBe(StatusCodes.CREATED);
    expect(result.body.id).toBeDefined();
    expect(result.body.city).toBe("City X");
    expect(result.body.complement).toBe("Complement X");
    expect(result.body.email).toBe("email@test.com");
    expect(result.body.name).toBe("Name X");
    expect(result.body.number).toBe("123");
    expect(result.body.state).toBe("State X");
    expect(result.body.street).toBe("Street X");
    expect(result.body.zipCode).toBe("00000000");
  });

  it("should find client by id", async () => {
    const client = await request(app)
      .post("/clients")
      .set("Accept", "application/json")
      .send({
        city: "City X",
        complement: "Complement X",
        document: "00000000000",
        email: "email@test.com",
        name: "Name X",
        number: "123",
        state: "State X",
        street: "Street X",
        zipCode: "00000000",
      } satisfies AddClientInputDto);

    const id = client.body.id;

    const result = await request(app)
      .get(`/clients/${id}`)
      .set("Accept", "application/json")
      .send();

    expect(result.statusCode).toBe(StatusCodes.OK);
    expect(result.body.id).toBeDefined();
    expect(result.body.city).toBe("City X");
    expect(result.body.complement).toBe("Complement X");
    expect(result.body.email).toBe("email@test.com");
    expect(result.body.name).toBe("Name X");
    expect(result.body.number).toBe("123");
    expect(result.body.state).toBe("State X");
    expect(result.body.street).toBe("Street X");
    expect(result.body.zipCode).toBe("00000000");
  });
});
