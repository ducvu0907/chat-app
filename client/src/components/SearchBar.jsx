import { useContext, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { ConversationContext } from "../context/ConversationContext";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const { selectedConversation, setSelectedConversation } = useContext(ConversationContext);

  const handleSearch = (e) => {
  };

  return (
    <form onSubmit={handleSearch} className='flex items-center gap-2'>
      <input
        type='text'
        placeholder='Search'
        className='input input-bordered rounded-full'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
        <IoSearchSharp className='w-6 h-6 outline-none' />
      </button>
    </form>
  );
};