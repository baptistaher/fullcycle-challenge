import express from "express";
import session from "express-session";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
  })
);

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-expect-error - type mismatch
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("base64");

  //@ts-expect-error - type mismatch
  req.session.nonce = nonce;

  req.session.save();

  const loginParams = new URLSearchParams({
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
    nonce,
  });

  console.log(loginParams.toString());

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;

  console.log(url);

  // console.log(req.session);
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  //here

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: "fullcycle-client",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: "http://localhost:3000/callback",
  });

  const url =
    "http://keycloak:8080/realms/fullcycle-realm/protocol/openid-connect/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error fetching token:", error);
    res.status(response.status).json({ error: "Failed to fetch token" });
  }

  console.log(response);

  const result = await response.json();

  const payloadAccessToken = jwt.decode(result.access_token);
  console.log(payloadAccessToken);

  //@ts-expect-error - type mismatch
  req.session.user = payloadAccessToken;
  //@ts-expect-error - type mismatch
  req.session.access_token = result.access_token;

  //@ts-expect-error - type mismatch
  req.session.id_token = result.id_token;

  // console.log(result);

  res.json(result);
  // res.send("ok");
});

app.get("/admin", middlewareIsAuth, (req, res) => {
  //@ts-expect-error - type mismatch
  res.json(req.session.user);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
