import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface LoginInfo {
  email: string;
  password: string;
}

export default function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useContext(AuthContext);

  const login = async (info: LoginInfo) => {
    const { email, password } = info;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
}