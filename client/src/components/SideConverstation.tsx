import { useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { AuthContext } from "../contexts/AuthContext";

export default function SideConversation({ conversation }) {
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);
  const isSelected = selectedConversation?._id === conversation._id;
  const isMonologue = !conversation.isGroup && conversation.participants[0]._id == conversation.participants[1]._id;
  const conversationName = conversation.isGroup ? conversation.name : (isMonologue ? authUser.name : conversation.participants.filter(p => p.name !== authUser.name)[0].name);
  const conversationPicture = conversation.isGroup ? conversation.picture : (isMonologue ? authUser.profilePic : conversation.participants.filter(p => p.name !== authUser.name)[0].profilePic);

  return (
    <>
      <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-300" : ""} border-b-2 border-b-gray-400`} onClick={() => setSelectedConversation(conversation)} >
        <div className={`avatar`}>
          <div className='w-10 rounded-full'>
            <img src={conversationPicture} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-300 ml-9'>{conversationName}</p>
          </div>
        </div>
      </div>
    </>
  );
};