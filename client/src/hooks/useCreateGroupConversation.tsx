import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ConversationsContext } from "../contexts/ConversationsContext";

export default function useCreateGroupConversation() {
  const [loading, setLoading] = useState(false);
  const { setConversations } = useContext(ConversationsContext);

  const createGroupConversation = async (participants: string[]) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data);
      setConversations(prevConvs => [data, ...prevConvs]);

    } catch (error) {
      toast.error((error as Error).message);

    } finally {
      setLoading(false);
    }
  }

  return { loading, createGroupConversation };
}
