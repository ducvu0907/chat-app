import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ConversationContext } from "../contexts/ConversationContext";

export default function useSendMessage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);

  const sendMessage = async (text: string, file: File | null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file);
      }
      const res = await fetch(`/api/messages/conversation/${selectedConversation?._id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      selectedConversation?.messages.push(data);
      setSelectedConversation({ ...selectedConversation });
      toast.success("message sent successfully");

    } catch (error) {
      toast.error((error as Error).message);

    } finally {
      setLoading(false);
    }
  }
  return { loading, sendMessage };
}