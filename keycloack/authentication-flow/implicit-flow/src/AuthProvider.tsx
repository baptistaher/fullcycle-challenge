import { createContext, useCallback, PropsWithChildren, useState } from "react";
import * as utils from "./utils";
import { JWTPayload } from "jose";
// import { makeLoginUrl } from "./utils";

type AuthContextProps = {
  auth: JWTPayload | null;
  makeLoginUrl: () => string;
  login: (
    accessToken: string,
    idToken: string,
    state: string
  ) => JWTPayload | null;
  makeLogoutUrl: () => string | false;
};

const initialContextData: AuthContextProps = {
  auth: null,
  makeLoginUrl: utils.makeLoginUrl,
  makeLogoutUrl: utils.makeLogoutUrl,
  login: () => null,
};

export const AuthContext = createContext<AuthContextProps>(initialContextData);

export const AuthProvider = (props: PropsWithChildren) => {
  const makeLogin = useCallback(
    (accessToken: string, idToken: string, state: string) => {
      const authData = utils.login(accessToken, idToken, state);

      setData((oldData) => ({
        auth: authData,
        makeLoginUrl: oldData.makeLoginUrl,
        login: oldData.login,
        makeLogoutUrl: oldData.makeLogoutUrl,
      }));

      return authData;
    },
    []
  );

  const [data, setData] = useState({
    auth: utils.getAuth(),
    makeLoginUrl: utils.makeLoginUrl,
    login: makeLogin,
    makeLogoutUrl: utils.makeLogoutUrl,
  });

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
};
