"use client";
import Link from "next/link";
import { useState } from "react";

interface ProfileProps {
  menuCollapsed: boolean;
  toggleMenu: () => void;
}

const Profile = ({ menuCollapsed, toggleMenu }: ProfileProps) => {

  return (
    <>
      <div className={`flex items-center justify-between py-1 mb-2 mx-1 ${menuCollapsed ? 'flex-col' : ''}`}>
        <div className="flex items-center">
          <div className="w-[30px] h-[30px] rounded-full mx-1 transition-all duration-300 ease-in-out hover:scale-110">
            <img src="/logo.ico" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h4 className={`text-yellow-800 text-xl ml-1 font-semibold transition-all duration-300 ${menuCollapsed ? 'hidden' : ''}`}>
            BIA_ADMIN
          </h4>
        </div>
        <i className="bi bi-grid text-xl cursor-pointer text-gray-500 hover:text-gray-700" onClick={toggleMenu}></i>
      </div>
    </>
  );
};

export default Profile;
