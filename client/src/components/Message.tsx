import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FaFile } from "react-icons/fa";

export default function Message({ message }) {
  const { authUser } = useContext(AuthContext);
  const messagePosition = message.sender._id === authUser?._id ? "chat-end" : "chat-start";
  const avatarColor = message.sender._id === authUser?._id ? "bg-blue-500" : "";
  const [showTime, setShowTime] = useState(false);

  const formattedTime = (date: Date) => {
    let hours = String(new Date(date).getHours());
    let minutes = String(new Date(date).getMinutes());
    if (parseInt(hours) < 10) {
      hours = '0' + hours;
    }
    if (parseInt(minutes) < 10) {
      minutes = 0 + minutes;
    }
    return `${hours}:${minutes}`;
  };

  const messageFile = () => {
    if (!message.file) {
      return null;
    }
    const source = `server${message.file.url}`;
    if (message.file.type.startsWith("image/")) {
      return (
        <img src={source} alt="image" className="w-32 h-32 object-cover rounded" />
      )
    } else if (message.file.type.startsWith("video/")) {
      return (
        <video controls src={source} className="w-32 h-32 object-cover rounded" />
      )
    } else {
      return (
        <a href={source} className="text-red-300 underline" download>
          <span><FaFile className="inline mr-2" /></span>
          {message.file.name || "download file"}
        </a>
      )
    }
  };

  const messageContent = () => {
    return (
      <>
        {message.text && <div>{message.text}</div>}
        {message.file && <div onClick={(e) => e.stopPropagation()}>{messageFile()}</div>}
      </>
    );
  };

  return (
    <div className={`chat ${messagePosition}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt='sender profile picture' src={message.sender.profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${avatarColor} pb-2 cursor-pointer`} onClick={() => setShowTime(!showTime)}>
        {messageContent()}
      </div>
      {showTime && <span className='chat-footer opacity-50 text-xs flex gap-1 items-center text-gray-300'>{formattedTime(message.createdAt)}</span>}
    </div>
  );
};