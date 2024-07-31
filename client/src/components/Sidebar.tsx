import LogoutButton from './LogoutButton';
import { AuthContext } from '../context/AuthContext';
import SideConversation from './SideConversation';
import { useContext } from 'react';
import useGetConversations from '../hooks/useGetConversations';

export default function Sidebar() {
  const { loading, conversations } = useGetConversations();
  const { authUser } = useContext(AuthContext);

  return (
    <div className="w-[30%] h-full border-r border-slate-600 p-4 flex flex-col bg-slate-800">
      {loading ? <span className="loading loading-spinner"></span> :
        <div className="w-full h-full bg-slate-600 rounded-md overflow-auto">
          <h2 className="text-center text-xl my-2 font-semibold">Messages</h2>
          {conversations.map((conversation, idx) => <SideConversation key={idx} conversation={conversation} />)}
        </div>
      }
      <div className="w-full flex justify-between border-2 border-slate-500 rounded-md p-1 mx-auto mt-2">
        <div className="flex">
          <img className="avatar m-2" width={"40px"} height={"40px"} src={authUser.profilePic} />
          <div className="flex flex-col my-auto">
            <p className="text-lg text-white">{authUser.fullName}</p>
            <p className="text-sm text-gray-500">#{authUser.username}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};