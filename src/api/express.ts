import type { Express } from "express";
import express = require("express");
import { productRoute } from "./routes/product.route";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../modules/store-catalog/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);

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
