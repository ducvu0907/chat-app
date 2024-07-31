import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function useGetConversations() {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setConversations(data);

      } catch (error) {
        toast.error(error.message);

      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);
  return { loading, conversations };
}