import useGetUsers from "../hooks/useGetUsers"
import SearchBar from "./SearchBar";
import UserStatus from "./UserStatus";

export default function UsersBar() {
  const { loading, users, defaultUsers } = useGetUsers();

  return (
    <div className="w-[30%] h-full border-r border-slate-800 p-4 flex flex-col bg-slate-500">
      <SearchBar defaultUsers={defaultUsers} />
      <div className="divider m-0"></div>
      {loading ? <span className="loading loading-spinner"></span> :
        <div className="w-full h-full bg-slate-300 rounded-md">
          {users.map((user, idx) => <UserStatus key={idx} user={user} />)}
        </div>
      }
    </div>
  )
}