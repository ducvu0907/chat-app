import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function useLogout() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useContext(AuthContext);

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("user");
      setAuthUser(null);
      toast.success("logged out successfully");

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}