import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindAllClientInputDto,
  FindAllClientOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUseCase: UseCaseInterface;
  addUseCase: UseCaseInterface;

  findAllUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  private _findAllUseCase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._addUseCase = useCaseProps.addUseCase;
    this._findUseCase = useCaseProps.findUseCase;

    this._findAllUseCase = useCaseProps.findAllUseCase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUseCase.execute(input);
  }
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUseCase.execute(input);
  }

  async findAll(input: FindAllClientInputDto): Promise<FindAllClientOutputDto> {
    return await this._findAllUseCase.execute(input);
  }
}
