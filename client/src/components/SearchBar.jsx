import { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { UsersContext } from "../context/FilteredUsersContext";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const { users, setUsers } = useContext(UsersContext);

  // FIXME: revert users array instead of refetching every single time but i'm too lazy to try
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setUsers(data);

      } catch (error) {
        toast.error(error);
      }
    };

    if (!searchInput) {
      fetchUsers();
    }
  }, [searchInput]);

  const handleSearchUser = (e) => {
    e.preventDefault();
    const search = searchInput.split(' ').join().toLocaleLowerCase();
    setUsers(users.filter(user => user.fullName.split(' ').join().toLocaleLowerCase().includes(search)));
  };

  return (
    <form onSubmit={handleSearchUser} className='flex items-center gap-2 mx-auto'>
      <input
        type='text'
        placeholder='Search'
        className='input input-bordered rounded-full bg-slate-600 text-white w-[80%]'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button type='submit' className='btn btn-circle bg-slate-500 text-white'>
        <IoSearchSharp className='w-5 h-5 outline-none' />
      </button>
    </form>
  );
};