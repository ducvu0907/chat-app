import { createContext, useState, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

interface AuthContextType {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({ authUser: null, setAuthUser: () => { } });

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>
    {children}
  </AuthContext.Provider>
}