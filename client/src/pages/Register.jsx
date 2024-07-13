import { useState } from "react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { setAuthUser } = useContext(AuthContext);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.message);
      }
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);

    } catch (error) {
      toast.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[400px] mt-5 border-4 border-stone-600 rounded-lg md'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <h3 className="text-center text-xl font-bold">Registration</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleRegister}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='full-name'>Full Name:</label>
            <input
              type='text'
              id='full-name'
              name='fullName'
              placeholder='enter your full name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.fullName}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              name='username'
              placeholder='enter your username'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.username}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.password}
              onChange={handleOnChange}
              minLength={6}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='confirm-password'>Confirm Password:</label>
            <input
              type='password'
              id='confirm-password'
              name='confirmPassword'
              placeholder='confirm your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.confirmPassword}
              onChange={handleOnChange}
              required
            />
          </div>

          {loading ? <FaSpinner /> :
            <button className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
              Sign up
            </button>
          }
        </form>

        <p className='my-3 text-center'>Already have account ? <Link to={"/login"} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}