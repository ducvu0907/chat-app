import { useContext } from "react";
import Messages from "./Messages";
import { ConversationContext } from "../contexts/ConversationContext";
import MessageInput from "./MessageInput";
import { AuthContext } from "../contexts/AuthContext";

export default function ConversationContainer() {
  const { selectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);

  const openVideoCall = () => {
    if (selectedConversation) {
      sessionStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
      window.open("/video-call", "_blank", "width=1200,height=800");
    }
  };

  return (
    <div className='w-full flex flex-col bg-gray-700'>
      {selectedConversation &&
        <div className='bg-slate-300 px-4 py-2 flex justify-between items-center'>
          <div>
            <img className="inline p-0 mr-2" src={selectedConversation?.isGroup ? selectedConversation?.picture :
              (selectedConversation?.participants.length === 1 ? authUser?.profilePic :
                (selectedConversation?.participants[0]._id === authUser?._id) ?
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
          <div>
            <button className="btn-primary bg-black p-2 rounded-md" onClick={openVideoCall}>
              Join call
            </button>
          </div>
        </div>
      }
      <Messages />
      {selectedConversation && <MessageInput />}
    </div>
  );
}