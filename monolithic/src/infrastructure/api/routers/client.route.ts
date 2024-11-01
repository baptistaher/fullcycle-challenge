import express, { Request, Response } from "express";
export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    req.log.info("Starting new Client");

    res.send("OK");
  } catch (error) {
    req.log.error(error);
    res.status(500).send(error);
  }
});
