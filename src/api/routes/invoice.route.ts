import * as express from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { FindInvoiceUseCaseOutputDTO } from "../../modules/invoice/usecase/find-invoice/find-invoice.dto";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";
import FindInvoiceUsecase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase";

export const invoiceRoute = express.Router();

invoiceRoute.get(
  "/:id",
  async (
    req: Request,
    res: Response<FindInvoiceUseCaseOutputDTO | unknown>
  ) => {
    const repository = new InvoiceRepository();
    const usecase = new FindInvoiceUsecase(repository);

    try {
      const result = await usecase.execute({
        id: req.params.id,
      });

      res.format({
        json: async () => res.status(StatusCodes.OK).send(result),
      });
    } catch (error) {
      console.error(error);
      res.format({
        json: async () =>
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error),
      });
    }
  }
);
