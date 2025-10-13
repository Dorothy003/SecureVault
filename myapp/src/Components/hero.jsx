import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from "react-typed";
const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className='text-white bg-[#0b1220]'>
      <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <h1 className='md:text-7xl sm:text-6xl text-4xl md:py-6'>
          Secure Collaboration. Simplified.
        </h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-3xl sm:text-3xl text-xl font-bold py-4'>
            A powerful tool for
          </p>
          <ReactTyped
            className='md:text-3xl sm:text-4xl md:pl-2 text-xl font-bold pl-2'
            strings={[
              'Hybrid File Encryption',
              'End-to-End Encrypted Chat',
              'Selective Data Protection'
            ]}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-gray-500'>
          Encrypt, share, and communicate with confidence — built for teams that value privacy.
        </p>
        <button 
          onClick={() => navigate('signin')}
          className='bg-[#00df9a] w-[200px] rounded-md my-6 mx-auto py-3 text-black'
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
