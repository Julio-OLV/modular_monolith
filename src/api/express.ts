import type { Express } from "express";
import express = require("express");
import { productRoute } from "./routes/product.route";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../modules/store-catalog/repository/product.model";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../../../database.sqlite",
    logging: false,
    models: [ProductModel, StoreCatalogModel],
    sync: { force: false },
  });
}

setupDb();
