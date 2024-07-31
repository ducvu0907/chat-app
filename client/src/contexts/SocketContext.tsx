import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext(undefined);

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser) {
      const socket = io("/api", {
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