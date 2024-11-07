import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import Id from "../../../@shared/domain/value-object/id.value-object";
import {
  ListClientInputDto,
  ListClientOutputDto,
} from "./list-client.usecase.do";

export default class ListClientUseCase {
  private _clientRepository: ClientGateway;

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: ListClientInputDto): Promise<ListClientOutputDto> {
    const clients = await this._clientRepository.findAll();

    return OutputClientMapper.toOutput(clients);
  }
}

class OutputClientMapper {
  static toOutput(clients: Client[]): ListClientOutputDto {
    return {
      clients: clients.map((client) => ({
        id: client.id.id,
        name: client.name,
        email: client.email,
        document: client.document,
        address: client.address,
      })),
    };
  }
}
