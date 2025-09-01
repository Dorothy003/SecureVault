
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../Api/axios.js'; // ✅ make sure this file exists
import toast from 'react-hot-toast';
const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/personalPage');
      toast.success("Signup Successfull")
    } catch (error) {
      toast.error("Error in SignUp")
      console.log("Error in SignUp: ",error)

    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0f172a] text-white'>
      <div className='bg-[#1e293b] p-8 rounded xl shadow-lg w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center text-[#00df9a] mb-6'>Create Account</h2>
        <form className='space-y-5' onSubmit={handleSignUp}>
          <div>
            <label className='block mb-1'>Full Name</label>
            <input
              name='name'
              type='text'
              value={form.name}
              onChange={handleChange}
              placeholder='John Doe'
              className='w-full p-3 rounded bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]'
            />
          </div>
          <div>
            <label className='block mb-1'>Email</label>
            <input
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full p-3 rounded bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]'
            />
          </div>
          <div>
            <label className='block mb-1'>Password</label>
            <input
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='w-full p-3 rounded bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-[#00df9a] text-black py-3 rounded font-bold hover:scale-105 transition-transform'
          >
            Register
          </button>
        </form>
        <p className='text-center text-sm text-gray-400 mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-[#00df9a] hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
