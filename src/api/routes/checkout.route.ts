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
    const repository = () => {}; // TODO: criar repository
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = TransactionFacadeFactory.create();
  }
);
