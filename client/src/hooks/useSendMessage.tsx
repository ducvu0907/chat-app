import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ConversationContext } from "../contexts/ConversationContext";
import { AuthContext } from "../contexts/AuthContext";

export default function useSendMessage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);

  const sendMessage = async (text: string, file: File | null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file);
      }
      let api;
      if (selectedConversation?.isGroup && !selectedConversation?.messages) {
        const receiverId = selectedConversation.participants[0].equals(authUser._id) ? selectedConversation.participants[1] : selectedConversation.participants[0];
        api = `api/messages/user/${receiverId}`;
      } else {
        api = `api/messages/conversation/${selectedConversation?._id}`;
      }

      const res = await fetch(api, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("message sent successfully");

    } catch (error) {
      toast.error((error as Error).message);

    } finally {
      setLoading(false);
    }
  }
  return { loading, sendMessage };
}