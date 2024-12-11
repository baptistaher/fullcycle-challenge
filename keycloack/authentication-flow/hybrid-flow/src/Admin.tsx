import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export function Admin() {
  const { auth } = useContext(AuthContext);
  return (
    <>
      <div>ADMIN</div>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </>
  );
}
