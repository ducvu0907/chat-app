import { FormEvent, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../hooks/useSendMessage";

export default function MessageInput({ messages, setMessages }) {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState(null);
  const { loading, sendMessage } = useSendMessage();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text, file });
  }

  return (
    <form className='px-4 mt-3 absolulte bottom-0' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5  bg-gray-600 border-gray-600 text-white mb-5'
          placeholder='Send a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type='file'
          className='border text-sm rounded-lg block w-full p-2.5  bg-gray-600 border-gray-600 text-white mb-5'
          placeholder='attach a file'
          value={text}
          onChange={(e) => setFile(e.target.files)}
        />
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
}