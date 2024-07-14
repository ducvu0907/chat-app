import { useState, useEffect, useContext } from "react";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";
import { ConversationContext } from "../context/ConversationContext";
import { UsersContext } from "../context/FilteredUsersContext";

export default function UsersBar() {
  const [loading, setLoading] = useState(false);
  const { users, setUsers } = useContext(UsersContext);
  const { setSelectedConversation } = useContext(ConversationContext);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setUsers(data);

      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const UserComponent = ({ user }) => {
    let isOnline = false;
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
      <SearchBar />
      <div className="divider m-0"></div>
      {loading ? <span className="loading loading-spinner"></span> :
        <div className="w-full h-full bg-slate-300 rounded-md">
          {users.map((user, idx) => <UserComponent key={idx} user={user} />)}
        </div>
      }
    </div>
  )
}