import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ConversationContext } from "../contexts/ConversationContext";

export default function Message({ message }) {
  const { authUser } = useContext(AuthContext);
  const { selectedConversation } = useContext(ConversationContext);
  const fromUser = message.senderId === authUser._id;
  const chatClassName = fromUser ? "chat-end" : "chat-start";
  const bubbleBgColor = fromUser ? "bg-blue-500" : "";

  const formattedTime = (date: Date) => {
    let hours = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt='Tailwind CSS chat bubble component' src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>{message.text}</div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-gray-300'>{formattedTime(message.createdAt)}</div>
    </div>
  );
};