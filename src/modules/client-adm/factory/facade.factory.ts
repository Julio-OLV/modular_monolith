import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

export default class FacadeFactory {
  static create(): ClientAdmFacade {
    const repository = new ClientRepository();
    const addUsecase = new AddClientUsecase(repository);
    const findUsecase = new FindClientUsecase(repository);

    const facade = new ClientAdmFacade({
      addUsecase,
      findUsecase,
    });

    return facade;
  }
}
