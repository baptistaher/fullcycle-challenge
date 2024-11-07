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
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

productAdmRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await facade.checkStock({ productId: req.params.id });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});
