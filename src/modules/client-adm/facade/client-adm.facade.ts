import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface ClientAdmFacadeProps {
  addUsecase: UseCaseInterface;
  findUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(props: ClientAdmFacadeProps) {
    this._addUsecase = props.addUsecase;
    this._findUsecase = props.findUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }

  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    const clientInDb = await this._findUsecase.execute(input);

    return {
      id: clientInDb.id,
      name: clientInDb.name,
      email: clientInDb.email,
      address: clientInDb.address,
      createdAt: clientInDb.createdAt,
      updatedAt: clientInDb.updatedAt,
    };
  }
}
