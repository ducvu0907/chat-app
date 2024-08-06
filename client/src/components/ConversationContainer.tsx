import { useContext } from "react";
import Messages from "./Messages";
import { ConversationContext } from "../contexts/ConversationContext";
import EmptyConversation from "./EmptyConversation";
import MessageInput from "./MessageInput";

export default function ConversationContainer() {
  const { selectedConversation } = useContext(ConversationContext);

  return (
    <div className='w-full flex flex-col bg-gray-700'>
      {!selectedConversation ? (<EmptyConversation />) : (
        <>
          <div className='bg-slate-500 px-4 py-2 mb-2'>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}