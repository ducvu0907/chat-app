import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface SignupInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useSignup() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuthUser } = useContext(AuthContext);

  const signup = async (info: SignupInfo) => {
    const { name, email, password, confirmPassword } = info;
    if (password !== confirmPassword) {
      toast.error("passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
}