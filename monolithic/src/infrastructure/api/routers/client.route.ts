import express, { Request, Response } from "express";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import Address from "../../../modules/@shared/domain/value-object/address";
import { FindClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ListClientUseCase from "../../../modules/client-adm/usecase/list-client/list-client.usecase";
import { FindClientUseCase } from "../../../modules/client-adm/usecase/find-client/find-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const repository = new ClientRepository();
  const useCase = new AddClientUseCase(repository);
  try {
    const client: AddClientInputDto = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.street,
        req.body.number,
        req.body.complement,
        req.body.city,
        req.body.state,
        req.body.zipCode
      ),
    };

    const output = await useCase.execute(client);

    return res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});

clientRoute.get("/", async (_: Request, res: Response) => {
  const repository = new ClientRepository();
  const useCase = new ListClientUseCase(repository);

  try {
    const result = await useCase.execute({});
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const repository = new ClientRepository();
    const useCase = new FindClientUseCase(repository);

    const input: FindClientFacadeInputDto = {
      id: req.params.id,
    };

    const result = await useCase.execute(input);
    return res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Client not found") {
        return res.status(404).send(error.message);
      }
      return res.status(400).send(error.message);
    }

    res.status(500).send(error);
  }
});
