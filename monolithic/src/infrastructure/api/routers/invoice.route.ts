import express from "express";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../../../modules/invoice/use-case/find-invoice/find-invoice.usecase";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req, res) => {
  try {
    const repository = new InvoiceRepository();
    const useCase = new FindInvoiceUseCase(repository);
    const invoiceInputDto = {
      id: req.params.id,
    };

    const output = await useCase.execute(invoiceInputDto);

    return res.status(200).send(output);
  } catch (error) {
    return res.status(500).send(error);
  }
  // res.send("invoice");
});
