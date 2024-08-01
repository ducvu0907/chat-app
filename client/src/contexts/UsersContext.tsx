import { createContext, ReactNode, useState } from "react";

interface UsersContextType {
  users: [];
  setUsers: React.Dispatch<React.SetStateAction<[]>>;
}

export const UsersContext = createContext<UsersContextType>({ users: [], setUsers: () => { } });

export function UsersContextProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<[]>([]);

  return <UsersContext.Provider value={{ users, setUsers }}>
    {children}
  </UsersContext.Provider>
}