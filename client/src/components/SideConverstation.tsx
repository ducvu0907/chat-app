import { useContext } from "react";
import { ConversationContext } from "../contexts/ConversationContext";
import { AuthContext } from "../contexts/AuthContext";
import useGetConversation from "../hooks/useGetConversation";

export default function SideConversation({ conversation }) {
  const { getConversationById } = useGetConversation();
  const { selectedConversation } = useContext(ConversationContext);
  const { authUser } = useContext(AuthContext);
  const isSelected = selectedConversation?._id === conversation._id;
  const isMonologue = !conversation.isGroup && conversation.participants.length === 1;
  const conversationName = conversation.isGroup ? conversation.name : (isMonologue ? authUser?.name : conversation.participants.filter(p => p._id !== authUser?._id)[0].name);
  const conversationPicture = conversation.isGroup ? conversation.picture : (isMonologue ? authUser?.profilePic : conversation.participants.filter(p => p._id !== authUser?._id)[0].profilePic);
  const lastMessage = conversation.messages.at(-1);
  const lastMessageSnippet = lastMessage.text ? `: ${lastMessage.text}` : ` sent an ${lastMessage.file?.type.startsWith("image/") ? "image" : "attachment"}`;
  const senderName = lastMessage.sender._id === authUser?._id ? "you" : lastMessage.sender.name;
  const isRead = conversation.messages.at(-1).seen.find(user => user._id === authUser?._id);

  const handleReadConversation = async () => {
    conversation.messages.at(-1).seen.push(authUser);
    await getConversationById(conversation._id);
  };

  return (
    <>
      <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer 
      ${isSelected && "bg-sky-300"} ${!isRead && "bg-white font-bold"} border-b-2 border-gray-400`}
        onClick={handleReadConversation} >
        <div className={`avatar`}>
          <div className='w-10 h-10 rounded-full overflow-hidden'>
            <img src={conversationPicture} alt='user avatar' className="object-cover w-full h-full" />
          </div>
        </div>

        <div className='flex flex-col flex-grow items-left w-[200px]'>
          <div className='flex justify-between'>
            <p className='text-gray-300'>{conversationName}</p>
          </div>
          <div className="text-md text-gray-400 line-clamp-1">
            {senderName}{lastMessageSnippet}
          </div>
        </div>
      </div>
    </>
  );
};