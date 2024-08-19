import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { ConversationsContext } from "../contexts/ConversationsContext";

export default function useGetConversations() {
  const [loading, setLoading] = useState<boolean>(false);
  const { conversations, setConversations } = useContext(ConversationsContext);

  useEffect(() => {
    setLoading(true);
    const getConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);

      } catch (error) {
        toast.error((error as Error).message);

      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
}