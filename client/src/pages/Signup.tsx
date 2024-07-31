import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import useSignup from "../hooks/useSignup";

interface SignUpInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [info, setInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { loading, signup } = useSignup();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(info);
  };

  return (
    <div className='w-[400px] mt-5 border-4 border-stone-600 rounded-lg md'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <h3 className="text-center text-xl font-bold">Register</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={info.name}
              onChange={handleOnChange}
              required
            />
          </div>

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