import { useContext, useEffect, useState } from "react"
import { ConversationContext } from "../context/ConversationContext"
import TiMessages from "react-icons/ti";

export default function ConversationContainer() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const NoSelectedConversation = () => {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
          <p>Welcome to Chat App</p>
          <p>Select a conversation to start messaging</p>
          <TiMessages className='text-3xl md:text-6xl text-center' />
        </div>
      </div>
    );
  };


  return (
    <div>ConversationContainer</div>
  )
}