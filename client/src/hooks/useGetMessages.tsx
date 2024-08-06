import { useState, useEffect, useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import toast from "react-hot-toast";

export default function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation?._id}`);
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setMessages(data);
        console.log(data);

      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation]);

  return { loading, messages };
}