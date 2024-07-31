import { createContext, ReactNode, useState } from "react";

export const AuthContext = createContext(undefined);

export function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState<string | null>(JSON.parse(localStorage.getItem("user") || "null"));

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>
    {children}
  </AuthContext.Provider>
}