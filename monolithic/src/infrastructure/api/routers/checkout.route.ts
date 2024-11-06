import express, { Request, Response } from "express";

export const checkoutRoute = express.Router();

// const facade = CheckoutFacadeFactory.create();

checkoutRoute.post("/", async (req: Request, res: Response) => {});
