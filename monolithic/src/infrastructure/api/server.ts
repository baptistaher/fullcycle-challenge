import { app } from "./express";
import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const port: number = Number(process.env.PORT) || 3000;

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
