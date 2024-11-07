import express, { Request, Response } from "express";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { FindClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
export const clientRoute = express.Router();

const facade = ClientAdmFacadeFactory.create();

clientRoute.post("/", async (req: Request, res: Response) => {
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

    const output = await facade.add(client);

    return res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});

clientRoute.get("/", async (_: Request, res: Response) => {
  console.log("Get all Client");
  try {
    const result = await facade.findAll({});
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  console.log("Get Client");
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
