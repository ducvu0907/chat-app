import { useState, useEffect, useContext } from "react";
import { UsersContext } from "../contexts/UsersContext";
import toast from "react-hot-toast";

export default function useGetUsers() {
  const [loading, setLoading] = useState(false);
  const { users, setUsers } = useContext(UsersContext);
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
        toast.error((error as Error).message);

      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return { loading, users, defaultUsers };
}