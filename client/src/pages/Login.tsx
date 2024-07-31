import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import useLogin from "../hooks/useLogin";

interface LoginInfo {
  email: string;
  password: string;
}

export default function Login() {
  const [info, setInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const { loading, login } = useLogin();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(info);
  };

  return (
    <div className='w-[400px] mt-5 border-4 border-stone-600 rounded-lg md'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <h3 className="text-center text-xl font-bold">Login</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.email}
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
              required
            />
          </div>

          {loading ? <FaSpinner /> :
            <button className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
              Sign in
            </button>
          }
        </form>

        <p className='my-3 text-center'>Don't have an account ? <Link to={"/register"} className='hover:text-primary font-semibold'>Register</Link></p>
      </div>
    </div>
  )
}