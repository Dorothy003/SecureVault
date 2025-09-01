import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navLinks = ["Home", "Company", "Resources", "About", "Contact"];

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">Secure Vault</h1>

      <ul className="hidden md:flex">
        {navLinks.map((link, index) => (
          <li
            key={index}
            className="relative p-4 cursor-pointer after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#00df9a] after:transition-all after:duration-300 hover:after:w-full"
          >
            {link}
          </li>
        ))}
      </ul>

     
      <div onClick={handleNav} className="block md:hidden z-10">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

     
      <div
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">Home</h1>
        <ul className="uppercase p-4">
          {navLinks.map((link, index) => (
            <li
              key={index}
              className="p-4 border-b border-gray-600 hover:text-[#00df9a] transition-colors duration-300"
            >
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;