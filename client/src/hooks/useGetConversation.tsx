import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ConversationContext } from "../contexts/ConversationContext";

export default function useGetConversation() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);

  const getConversationByUserId = async (receiverId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/user/${receiverId}`);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSelectedConversation(data);

    } catch (error) {
      toast.error((error as Error).message);

    } finally {
      setLoading(false);
    }
  }

  const getConversationById = async (conversationId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSelectedConversation(data);

    } catch (error) {
      toast.error((error as Error).message);

    } finally {
      setLoading(false);
    }
  }

  return { loading, getConversationByUserId, getConversationById };
}