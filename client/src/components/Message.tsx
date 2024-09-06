import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FaFile } from "react-icons/fa";
import ReactDOM from 'react-dom';
import { FaRegCircleXmark } from "react-icons/fa6";

export default function Message({ message }) {
  const { authUser } = useContext(AuthContext);
  const messagePosition = message.sender._id === authUser?._id ? "chat-end" : "chat-start";
  const avatarColor = message.sender._id === authUser?._id ? "bg-blue-500" : "";
  const [showTime, setShowTime] = useState(false);
  const [modelImageSrc, setModelImageSrc] = useState("");

  const messageTimestamp = (date: Date) => {
    let hours = String(new Date(date).getHours());
    let minutes = String(new Date(date).getMinutes());
    if (parseInt(hours) < 10) {
      hours = '0' + hours;
    }
    if (parseInt(minutes) < 10) {
      minutes = 0 + minutes;
    }
    return `sent at ${hours}:${minutes}`;
  };

  const ImageModal = () => {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setModelImageSrc("")}>
        <div className="relative max-w-full max-h-full">
          <button className="absolute top-2 right-2 text-white bg-gray-600 rounded-full text-4xl" onClick={() => setModelImageSrc("")}>
            <FaRegCircleXmark />
          </button>
          <img src={modelImageSrc} alt="large view" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      </div>,
      document.body
    );
  };

  const messageFile = () => {
    if (!message.file) {
      return null;
    }
    const source = `http://localhost:5000/static/${message.file.name}`;
    if (message.file.type.startsWith("image/")) {
      return (
        <img src={source} alt="image" className="w-32 h-32 object-cover rounded" onClick={() => setModelImageSrc(source)} />
      )
    } else if (message.file.type.startsWith("video/")) {
      return (
        <video controls src={source} className="w-32 h-32 object-cover rounded" />
      )
    } else {
      return (
        <a href={source} target="_blank" className="text-red-300 underline" download>
          <span><FaFile className="inline mr-2" /></span>
          {message.file.name || "download file"}
        </a>
      )
    }
  };

  const messageContent = () => {
    return (
      <>
        {message.text && <div className="max-w-[250px] break-all">{message.text}</div>}
        {message.file && <div onClick={(e) => e.stopPropagation()}>{messageFile()}</div>}
      </>
    );
  };

  return (
    <div className={`chat ${messagePosition}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt='profile picture' src={message.sender.profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${avatarColor} pb-2 cursor-pointer ${showTime && "mt-2 bg-gray-500"}`}
        onClick={() => setShowTime(!showTime)}>
        {messageContent()}
      </div>
      {showTime && <span className='chat-footer opacity-50 text-xs flex gap-1 items-center text-gray-300'>
        {messageTimestamp(message.createdAt)}
      </span>}
      {modelImageSrc && <ImageModal />}
    </div>
  );
};