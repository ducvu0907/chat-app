import { BiLogOut } from "react-icons/bi";
import useLogout from "../hooks/useLogout";

export default function LogoutButton() {
  const { loading, logout } = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='my-auto'>
      {!loading ? (
        <BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={handleLogout} />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};