import express, { Request, Response } from "express";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { FindClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
export const clientRoute = express.Router();

const facade = ClientAdmFacadeFactory.create();

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    // const clientFacade = new ClientAdmFacadeFactory();

    // req.log.info("Starting new Client");

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

    const output = await facade.add(client);

    res.status(200).send(output);
  } catch (error) {
    // req.log.error(error);
    res.status(500).send(error);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const input: FindClientFacadeInputDto = {
      id: req.params.id,
    };

    const result = await facade.find(input);
    res.status(200).send(result);
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
