import { useContext, useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import SearchBar from './SearchBar';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const [loading, setLoading] = useState(false);
  const { authUser } = useContext(AuthContext);

  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <SearchBar />
      <div className='divider px-3'></div>
      <LogoutButton />
    </div>
  );
};