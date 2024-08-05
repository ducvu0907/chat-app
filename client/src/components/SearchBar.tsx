import { FormEvent, useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { UsersContext } from "../contexts/UsersContext";

export default function SearchBar({ defaultUsers }) {
  const [searchInput, setSearchInput] = useState<string>("");
  const { setUsers } = useContext(UsersContext);

  useEffect(() => {
    if (!searchInput) {
      setUsers(defaultUsers);
    }
  }, [searchInput]);

  const handleSearchUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = searchInput.trim().toLowerCase();
    if (!searchQuery) {
      return;
    }
    const filteredUsers = defaultUsers.filter(user => user.fullName.toLowerCase().includes(searchQuery));
    setUsers(filteredUsers);
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