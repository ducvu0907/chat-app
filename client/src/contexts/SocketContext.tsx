import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: any[];
}

export const SocketContext = createContext<SocketContextType>({ socket: null, onlineUsers: [] });

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
        console.log(users);
      });

    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}> {children}</SocketContext.Provider>
}