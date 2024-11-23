import express, { Express } from "express";
import pino from "pino-http";

const logger = pino();

export const app: Express = express();

app.use(logger);
