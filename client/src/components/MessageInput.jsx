import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";
import { ConversationContext } from "../context/ConversationContext";

export default function MessageInput() {
  const { selectedConversation } = useContext(ConversationContext);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !imageUrl && !videoUrl) {
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`api/message/send/${selectedConversation._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, imageUrl, videoUrl }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.message);
      }
      toast.success("Message sent!");

    } catch (error) {
      toast.error(error);

    } finally {
      setLoading(false);
      setText("");
      setImageUrl("");
      setVideoUrl("");
    }
  };

  return (
    <form className='px-4 mt-3 absolulte bottom-0' onSubmit={handleSendMessage}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5  bg-gray-600 border-gray-600 text-white mb-5'
          placeholder='Send a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
}