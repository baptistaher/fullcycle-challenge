import { app, logger } from "./express";
import dotenv from "dotenv";

dotenv.config();

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
