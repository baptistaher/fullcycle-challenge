import { createContext, useCallback, PropsWithChildren, useState } from "react";
import * as utils from "./utils";
import { JWTPayload } from "jose";

type AuthContextProps = {
  auth: JWTPayload | null;
  makeLoginUrl: () => string;
  login: (
    accessToken: string,
    idToken: string,
    state: string
  ) => JWTPayload | null;
  logout: () => void;
};

const initialContextData: AuthContextProps = {
  auth: null,
  makeLoginUrl: utils.makeLoginUrl,
  login: () => null,
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialContextData);

export const AuthProvider = (props: PropsWithChildren) => {
  console.log("here");
  const makeLogin = useCallback(
    (accessToken: string, idToken: string, state: string) => {
      const authData = utils.login(accessToken, idToken, state);

      setData((oldData) => ({
        auth: authData,
        makeLoginUrl: oldData.makeLoginUrl,
        login: oldData.login,
        logout: oldData.logout,
      }));

      return authData;
    },
    []
  );

  const [data, setData] = useState({
    auth: utils.getAuth(),
    makeLoginUrl: utils.makeLoginUrl,
    login: makeLogin,
    logout: utils.logout,
  });

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
};
