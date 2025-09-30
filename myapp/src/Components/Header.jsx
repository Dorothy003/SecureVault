// components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
     <div className="flex justify-between items-center">
      <h1 className="text-white font-bold text-lg">Dashboard</h1>
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Header;
