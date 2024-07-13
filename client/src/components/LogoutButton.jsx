import { BiLogOut } from "react-icons/bi";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const { setAuthUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e) => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.message);
      }
      localStorage.removeItem("user");
      setAuthUser(null);

    } catch (error) {
      toast.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-auto'>
      {!loading ? (
        <BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={handleLogout} />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};