import * as express from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import ClientRepository from "../../modules/client-adm/repository/client.repository";
import AddClientUsecase from "../../modules/client-adm/usecase/add-client/add-client.usecase";
import {
  FindClientInputDto,
  FindClientOutputDto,
} from "../../modules/client-adm/usecase/find-client/find-client.usecase.dto";
import FindClientUsecase from "../../modules/client-adm/usecase/find-client/find-client.usecase";
import ClientNotFoundError from "../../modules/client-adm/error/client-not-found.error";

export const clientRoute = express.Router();

clientRoute.post(
  "/",
  async (
    req: Request<any, any, AddClientInputDto>,
    res: Response<AddClientOutputDto | unknown>
  ) => {
    const repository = new ClientRepository();
    const usecase = new AddClientUsecase(repository);

    try {
      const result = await usecase.execute(req.body);

      res.format({
        json: async () => res.status(StatusCodes.CREATED).send(result),
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

clientRoute.get(
  "/:id",
  async (
    req: Request<any, any, FindClientInputDto>,
    res: Response<FindClientOutputDto | unknown>
  ) => {
    const repository = new ClientRepository();
    const usecase = new FindClientUsecase(repository);

    try {
      const result = await usecase.execute({
        id: req.params.id,
      } satisfies FindClientInputDto);

      res.format({
        json: async () => res.status(StatusCodes.OK).send(result),
      });
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        res.format({
          json: async () => res.status(StatusCodes.NOT_FOUND).send(error),
        });
      } else {
        console.error(error);
        res.format({
          json: async () =>
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error),
        });
      }
    }
  }
);
