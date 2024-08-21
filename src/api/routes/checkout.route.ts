import * as express from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  PlaceOrderUsecaseInputDto,
  PlaceOrderUsecaseOutputDto,
} from "../../modules/checkout/usecase/place-order/place-order.dto";
import FacadeFactory from "../../modules/client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../modules/store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../../modules/invoice/factory/facade.factory";
import TransactionFacadeFactory from "../../modules/payment/factory/transaction.facade.factory";
import CheckoutRepository from "../../modules/checkout/repository/checkout.repository";
import PlaceOrderUsecase from "../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientNotFoundError from "../../modules/checkout/error/client-not-found.error";
import ProductNotFoundError from "../../modules/checkout/error/product-not-found.error";
import NoProductsSelectedError from "../../modules/checkout/error/no-products-selected.error";

export const checkoutRoute = express.Router();

checkoutRoute.post(
  "/",
  async (
    req: Request<any, any, PlaceOrderUsecaseInputDto>,
    res: Response<PlaceOrderUsecaseOutputDto | unknown>
  ) => {
    const clientFacade = FacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new CheckoutRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = TransactionFacadeFactory.create();

    const usecase = new PlaceOrderUsecase(
      clientFacade,
      productFacade,
      catalogFacade,
      repository,
      invoiceFacade,
      paymentFacade
    );

    try {
      const result = await usecase.execute(req.body);

      res.format({
        json: async () => res.status(StatusCodes.CREATED).send(result),
      });
    } catch (error) {
      if (
        error instanceof ClientNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof NoProductsSelectedError
      ) {
        console.error(error);
        res.format({
          json: async () => res.status(StatusCodes.NOT_FOUND).send(error),
        });
      }

      console.error(error);
      res.format({
        json: async () =>
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error),
      });
    }
  }
);
