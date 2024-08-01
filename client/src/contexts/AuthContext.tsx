import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  authUser: {} | null;
  setAuthUser: React.Dispatch<React.SetStateAction<{} | null>>;
}

export const AuthContext = createContext<AuthContextType>({ authUser: null, setAuthUser: () => { } });

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<{} | null>(JSON.parse(localStorage.getItem("user") || "null"));

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>
    {children}
  </AuthContext.Provider>
}