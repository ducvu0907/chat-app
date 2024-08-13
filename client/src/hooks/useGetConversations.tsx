import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { ConversationContext } from "../contexts/ConversationContext";

export default function useGetConversations() {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState([]);
  const { selectedConversation } = useContext(ConversationContext);

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
        toast.error((error as Error).message);

      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  // update conversations locally instead of refetching
  useEffect(() => {
    const updateConversation = () => {
      setConversations((prev) => prev.map((c) => c._id === selectedConversation._id ? { ...c, ...selectedConversation } : c))
    };
    if (selectedConversation) {
      updateConversation();
    }
  }, [selectedConversation]);

  return { loading, conversations };
}