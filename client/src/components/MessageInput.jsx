import { useState } from "react";
import toast from "react-hot-toast";

export default function MessageInput() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text && !imageUrl && !videoUrl) {
      return;
    }
    setLoading(true);

    try {

    } catch (error) {
      toast.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSendMessage}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
}