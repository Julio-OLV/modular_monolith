import * as express from "express";
import { Request, Response } from "express";
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
    } catch (error) {
      console.error(error);
    }
  }
);
