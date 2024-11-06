import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductInputDto } from "../../../modules/product-adm/usecase/add-product/add-product.dto";
export const productAdmRoute = express.Router();

const facade = ProductAdmFacadeFactory.create();
productAdmRoute.post("/", async (req: Request, res: Response) => {
  try {
    const input: AddProductInputDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };
    const result = await facade.addProduct(input);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
  // res.status(200).send("Hello World!");
});
