import express, { Request, Response } from "express";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";
import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    // const clientFacade = new ClientAdmFacadeFactory();

    const facade = ClientAdmFacadeFactory.create();
    req.log.info("Starting new Client");

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

    await facade.add(client);

    res.status(200);
  } catch (error) {
    req.log.error(error);
    res.status(500).send(error);
  }
});

// clientRoute.get("/", async (req: Request, res: Response) => {
//   try {
//     const facade = ClientAdmFacadeFactory.create();
//     const result = await facade.find();
//     res.status(200).send(result);
//   } catch (error) {
//     req.log.error(error);
//     res.status(500).send(error);
//   }
// });
