import { useContext } from "react";
import Messages from "./Messages";
import { ConversationContext } from "../contexts/ConversationContext";
import MessageInput from "./MessageInput";
import { AuthContext } from "../contexts/AuthContext";

export default function ConversationContainer() {
  const { selectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);

  return (
    <div className='w-full flex flex-col bg-gray-700'>
      {selectedConversation &&
        <div className='bg-slate-300 px-4 py-2'>
          <img className="inline p-0 mr-2" src={selectedConversation?.isGroup ? selectedConversation?.picture :
            (selectedConversation?.participants.length === 1 ? authUser?.profilePic :
              (selectedConversation?.participants[0]._id === authUser._id) ?
                selectedConversation?.participants[1].profilePic :
                selectedConversation?.participants[0].profilePic)}
            width={"45px"} height={"45px"}
          />
          <span className='text-black font-bold'>
            {selectedConversation?.isGroup ? selectedConversation?.name :
              (selectedConversation?.participants.length === 1 ? authUser?.name :
                (selectedConversation?.participants[0]._id === authUser?._id) ? selectedConversation?.participants[1].name : selectedConversation?.participants[0].name)}
          </span>
        </div>
      }
      <Messages />
      {selectedConversation && <MessageInput />}
    </div>
  );
}