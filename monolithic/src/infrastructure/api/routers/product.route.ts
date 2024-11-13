import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductInputDto } from "../../../modules/product-adm/usecase/add-product/add-product.dto";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const repository = new ProductRepository();
  const useCase = new AddProductUseCase(repository);
  try {
    const input: AddProductInputDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      salesPrice: req.body.salesPrice,
      stock: req.body.stock,
    };
    const result = await useCase.execute(input);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
