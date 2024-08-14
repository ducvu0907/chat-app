import { useContext } from "react";
import useGetConversation from "../hooks/useGetConversation"
import { SocketContext } from "../contexts/SocketContext";

export default function UserStatus({ user }) {
  const { getConversationByUserId } = useGetConversation();
  const { onlineUsers } = useContext(SocketContext);
  let isOnline = onlineUsers.includes(user._id);

  return (
    <>
      <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer border-b-2 border-b-gray-400`} onClick={() => getConversationByUserId(user._id)} >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className='w-10 rounded-full'>
            <img src={user.profilePic} alt='user profile picture' />
          </div>
        </div>

        <div className='flex flex-col w-[170px]'>
          <div className='flex items-left p-2'>
            <p className='text-black line-clamp-1'>{user.name}</p>
          </div>
        </div>
      </div >
    </>
  )
};