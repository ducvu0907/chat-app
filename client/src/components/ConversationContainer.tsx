import { useContext } from "react";
import Messages from "./Messages";
import { ConversationContext } from "../contexts/ConversationContext";
import EmptyConversation from "./EmptyConversation";
import MessageInput from "./MessageInput";
import { AuthContext } from "../contexts/AuthContext";

export default function ConversationContainer() {
  const { selectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);

  return (
    <div className='w-full flex flex-col bg-gray-700'>
      {!selectedConversation ? (<EmptyConversation />) : (
        <>
          <div className='bg-slate-300 px-4 py-2'>
            <span className='text-black font-bold'>
              {selectedConversation.isGroup ? selectedConversation.name :
                (selectedConversation.participants.length === 1 ? selectedConversation.participants[0].name :
                  (selectedConversation.participants[0].name === authUser?.name ? selectedConversation.participants[1].name :
                    authUser?.name))}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}