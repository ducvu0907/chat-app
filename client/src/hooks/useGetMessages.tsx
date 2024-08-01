import { useState, useEffect, useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { SocketContext } from "../contexts/SocketContext";
import toast from "react-hot-toast";

export default function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);

  const getMessages = async () => {
    useEffect(() => {
      const getMessages = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/message/${selectedConversation._id}`);
          const data = await res.json();
          if (data.error) {
            throw new Error(data.message);
          }
          setMessages(data);
          console.log(data);

        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      if (selectedConversation?._id) {
        getMessages();
      }
    }, [selectedConversation, messages.length]);
  };

  return { loading, messages };
}