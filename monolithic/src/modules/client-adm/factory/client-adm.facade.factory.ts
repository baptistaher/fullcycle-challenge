import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../../../infrastructure/client-adm/repository/sequelize/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import { FindClientUseCase } from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const repository = new ClientRepository();
    const findUseCase = new FindClientUseCase(repository);
    const addUseCase = new AddClientUseCase(repository);
    const findAllUseCase = new FindClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: findUseCase,
      findAllUseCase: findAllUseCase,
    });

    return facade;
  }
}
