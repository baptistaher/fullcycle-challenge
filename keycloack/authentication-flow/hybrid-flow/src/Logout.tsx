import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
export function Logout() {
  const { makeLogoutUrl } = useContext(AuthContext);

  useEffect(() => {
    const logoutUrl = makeLogoutUrl();
    if (typeof logoutUrl === "string") {
      window.location.href = logoutUrl;
    }
  }, [makeLogoutUrl]);

  return (
    <>
      <div>LOGOUT</div>
    </>
  );
}
