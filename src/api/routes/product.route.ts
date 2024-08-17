import * as express from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AddProductUseCase from "../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../modules/product-adm/repository/product.repository";
import CatalogRepository from "../../modules/store-catalog/repository/product.repository";
import {
  AddProductInputDto,
  AddProductOutputDto,
} from "../../modules/product-adm/usecase/add-product/add-product.dto";
import FindAllProductsUsecase from "../../modules/store-catalog/usecase/find-all-products/find-all-products.usecase";
import { FindAllProductDto } from "../../modules/store-catalog/usecase/find-all-products/find-all-products.dto";

export const productRoute = express.Router();

productRoute.post(
  "/",
  async (
    req: Request<any, any, AddProductInputDto>,
    res: Response<AddProductOutputDto | unknown>
  ) => {
    const repository = new ProductRepository();
    const usecase = new AddProductUseCase(repository);

    try {
      const response = await usecase.execute(req.body);

      res.format({
        json: async () => res.status(StatusCodes.CREATED).send(response),
      });
    } catch (error) {
      console.log(error);
      res.format({
        json: async () =>
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error),
      });
    }
  }
);

productRoute.get(
  "/",
  async (_: Request, res: Response<FindAllProductDto | unknown>) => {
    const repository = new CatalogRepository();
    const usecase = new FindAllProductsUsecase(repository);

    try {
      const response = await usecase.execute();

      if (response.products.length === 0) {
        res.format({
          json: async () => res.status(StatusCodes.NO_CONTENT).send(response),
        });
      }

      res.format({
        json: async () => res.status(StatusCodes.OK).send(response),
      });
    } catch (error) {
      console.log(error);
      res.format({
        json: async () =>
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error),
      });
    }
  }
);
