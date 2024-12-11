import express from "express";
import session, { SessionData } from "express-session";
import crypto from "crypto";

const app = express();
app.use(express.urlencoded({ extended: true }));

const memoryStore = new session.MemoryStore();

interface CustomSessionData extends SessionData {
  user?: any;
  nonce?: string;
  state?: string;
}

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
    //expires
  })
);

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const sessionData = req.session as CustomSessionData;
  if (!sessionData.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  const sessionData = req.session as CustomSessionData;
  if (sessionData.user) {
    return res.redirect("/admin");
  }
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const response = await fetch(
    "http://keycloak:8080/realms/fullcycle-realm/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "fullcycle-client",
        grant_type: "password",
        username: username,
        password: password,
        spoce: "openid",
      }).toString(),
    }
  );

  const result = await response.json();
  console.log(result);

  (req.session as CustomSessionData).user = result;
  req.session.save();

  res.redirect("/admin");
});

app.get("/logout", async (req, res) => {
  // const sessionData = req.session as CustomSessionData;
  // if (sessionData && sessionData.user && sessionData.user.id_token) {
  //   const logoutParams = new URLSearchParams({
  //     id_token_hint: (req.session as CustomSessionData).user.id_token,
  //     post_logout_redirect_uri: "http://localhost:3000/login",
  //   });
  //   req.session.destroy((err) => {
  //     console.error(err);
  //   });
  //   const url = `http://keycloak:8080/realms/fullcycle-realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
  //   res.redirect(url);
  // } else {
  //   // handle error or invalid session
  // }
  // await fetch(
  //   "http://host.docker.internal:8080/realms/fullcycle-realm/protocol/openid-connect/revoke",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       client_id: "fullcycle-client",
  //       //@ts-expect-error
  //       token: req.session.user.refresh_token,
  //     }).toString(),
  //   }
  // );
  // req.session.destroy((err) => {
  //   console.error(err);
  // });
  // res.redirect("/login");
});

app.get("/admin", middlewareIsAuth, (req, res) => {
  res.json((req.session as CustomSessionData).user);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
