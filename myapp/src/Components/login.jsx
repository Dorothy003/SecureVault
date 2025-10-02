
import axios from '../Api/axios.js';
import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
const SignIn = () => {
  const navigate=useNavigate();
  const [form , setForm]=useState({email:'',password:''})

 const handleSignIn = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/auth/login', form);

    // Backend returns { access_token, token_type }
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('token_type', res.data.token_type);

    toast.success("Login Successful");
    navigate('/dashboard');
  } catch (error) {
    toast.error("Login Failed: Invalid details");
    console.log(error.response?.data || error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className='bg-[#1e293b] p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h2 className='text-3l font-bold text-center text-[#00df9a] mb-6'>Sign In</h2>
       <form className='space-y-5'>
        <div>
          <label className='block mb-1'>Email</label>
          <input 
            type="email"
            placeholder='Enter your email'
            className='w-full p-3 rounded bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]'
            onChange={e=>setForm({...form,email:e.target.value})}
          />
        </div>
          <div>
          <label className='block mb-1'>Password</label>
          <input 
            type="password"
            placeholder='Enter your password'
            className='w-full p-3 rounded bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]'
             onChange={e=>setForm({...form,password:e.target.value})}
          />
            </div>
          <button type='submit'
              onClick={handleSignIn}
              className='w-full bg-[#00df9a] text-black py-3 rounded font-bold hover:scale-105 transition-transform'          
           >Sign In</button>
        
       </form>
       <p className='text-center text-sm text-gray-400 mt-4'>
        Dont't have an account?{' '}
        <Link to="/signin" className="text-[#00df9a] hover:underline">
          Sign Up
        </Link>
       </p>
     
     
      </div>
    </div>
  )
}

export default SignIn
