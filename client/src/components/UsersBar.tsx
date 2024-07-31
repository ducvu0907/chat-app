import { useContext } from "react";

export default function UsersBar() {
  const UserComponent = ({ user }) => {
    const { onlineUsers } = useContext(SocketContext);
    let isOnline = onlineUsers.includes(user._id);

    return (
      <div className={`flex gap-2 items-center hover:bg-blue-800 p-2 py-1 cursor-pointer border-b-2 border-b-gray-400`} onClick={() => setSelectedConversation(user)}>
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className='w-10 rounded-full'>
            <img src={user.profilePic} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='text-black'>{user.fullName} <span className="text-sm text-gray-500">#{user.username}</span></p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="w-[30%] h-full border-r border-slate-800 p-4 flex flex-col bg-slate-500">
      <SearchBar defaultUsers={defaultUsers} />
      <div className="divider m-0"></div>
      {loading ? <span className="loading loading-spinner"></span> :
        <div className="w-full h-full bg-slate-300 rounded-md">
          {users.map((user, idx) => <UserComponent key={idx} user={user} />)}
        </div>
      }
    </div>
  )
}