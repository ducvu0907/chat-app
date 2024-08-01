import { useState, useEffect, useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { UsersContext } from "../contexts/UsersContext";
import toast from "react-hot-toast";

export default function useGetUsers() {
  const [loading, setLoading] = useState(false);
  const { users, setUsers } = useContext(UsersContext);
  const { setSelectedConversation } = useContext(ConversationContext);
  const [defaultUsers, setDefaultUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setUsers(data);
        setDefaultUsers(data);

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return { loading, users };
}