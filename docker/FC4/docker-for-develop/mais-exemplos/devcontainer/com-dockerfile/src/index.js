const express = require("express");
const pinoHttp = require("pino-http");
const pino = require("pino");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levels: {
        fatal: "red",
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "blue",
        trace: "magenta",
      },
    },
  },
});

const app = express();
const port = 3000;

app.use(pinoHttp({ logger }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/external-api", async function (req, res) {
  // const address = "http://host.docker.internal:9000/products";
  const address = "http://external-api:9000/products";
  const response = await fetch(address);
  const data = await response.json();
  res.send(data);
});

app.get("/test-db", async function (req, res) {
  const mysql = require("mysql2");

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  connection.connect();
  res.send("Connect to DB");
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
