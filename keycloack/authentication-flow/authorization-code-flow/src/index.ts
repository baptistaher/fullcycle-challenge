import express, { Response, Request, NextFunction } from "express";
import session from "express-session";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface SessionData {
  user?: any; // Define the user type explicitly if possible
  nonce?: string;
  access_token?: string;
  id_token?: string;
  state?: string;
  codeVerifier?: string;
}

const globalSessionData: SessionData = {};

const app = express();

const memoryStore = new session.MemoryStore();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
    //expires
  })
);

const middlewareIsAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!globalSessionData.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("base64");

  const codeVerifier = crypto.randomBytes(32).toString("hex");

  globalSessionData.nonce = nonce;

  globalSessionData.codeVerifier = codeVerifier;

  // req.session.save();

  const loginParams = new URLSearchParams({
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
    nonce: nonce,
  });

  console.log(loginParams.toString());

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;

  console.log(url);

  res.redirect(url);
});

app.get(
  "/callback",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storedState = globalSessionData.state;
      const storedNonce = globalSessionData.nonce;
      // const storedCodeVerify = globalSessionData.codeVerify;

      if (globalSessionData.user) {
        return res.redirect("/admin");
      }
      if (req.query.state !== globalSessionData.state) {
        //poderia redirecionar para o login em vez de mostrar o erro
        return res.status(401).json({ message: "Unauthenticated" });
      }
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
        return res
          .status(response.status)
          .json({ error: "Failed to fetch token" });
      }

      console.log(response);

      const result = await response.json();

      const payloadAccessToken = jwt.decode(result.access_token) as any;
      const payloadIdToken = jwt.decode(result.id_token) as any;
      const payloadRefreshToken = jwt.decode(result.refresh_token) as any;

      console.log(payloadAccessToken);

      if (
        payloadAccessToken?.nonce !== globalSessionData.nonce ||
        payloadRefreshToken?.nonce !== globalSessionData.nonce ||
        payloadIdToken?.nonce !== globalSessionData.nonce
      ) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      globalSessionData.user = payloadAccessToken;

      globalSessionData.access_token = result.access_token;

      globalSessionData.id_token = result.id_token;

      req.session.save();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  })
);

app.get("/admin", middlewareIsAuth, (req, res) => {
  res.json(globalSessionData.user);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
