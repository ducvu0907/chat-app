import { createContext, useState } from "react";

export const UsersContext = createContext(undefined);

export function UsersContextProvider({ children }) {
  const [users, setUsers] = useState([]);

  return <UsersContext.Provider value={{ users, setUsers }}>
    {children}
  </UsersContext.Provider>
}