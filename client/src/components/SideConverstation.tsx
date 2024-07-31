import { useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";

export default function SideConversation({ conversation }) {
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-300" : ""} border-b-2 border-b-gray-400`} onClick={() => setSelectedConversation(conversation)} >
        <div className={`avatar`}>
          <div className='w-10 rounded-full'>
            <img src={conversation.profilePic} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-300 ml-9'>{conversation.fullName}</p>
          </div>
        </div>
      </div>
    </>
  );
};