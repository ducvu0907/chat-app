import { useContext } from "react";
import useGetConversation from "../hooks/useGetConversation"
import { SocketContext } from "../contexts/SocketContext";

export default function UserStatus({ user }) {
  const { getConversationByUserId } = useGetConversation();
  const { onlineUsers } = useContext(SocketContext);
  let isOnline = onlineUsers.includes(user._id);

  return (
    <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer border-b-2 border-b-gray-400`} onClick={() => getConversationByUserId(user._id)} >
      <div className={`avatar ${isOnline ? "online" : ""}`}>
        <div className='w-10 rounded-full'>
          <img src={user.profilePic} alt='user profile picture' />
        </div>
      </div>

      <div className='flex flex-col flex-1'>
        <div className='flex gap-3 justify-between'>
          <p className='text-black'>{user.name} <span className="text-sm text-gray-500">#{user.email.split('@')[0]}</span></p>
        </div>
      </div>
    </div >
  )
};