import { useState } from "react";
import toast from "react-hot-toast";

export default function useGetMessages() {
  const [loading, setLoading] = useState(false);

  const getMessages = async (conversation) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${conversation?._id}`);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      conversation.messages = [...data];

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getMessages };
}