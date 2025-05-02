"use client";
import { useState } from "react";
import Link from "next/link";
import ProfileStatus from "./profileStatus";

const links = [
  { href: "/dash/profile", icon: "bi-person", text: "Personal informations", desc: "View and edit your details" },
  //{ href: "/dash/profile/login_security", icon: "bi-shield", text: "Login and security", desc: "Manage account authentication" },
//  { href: "/dash/profile/personal_address", icon: "bi-geo-alt", text: "Personal address", desc: "Manage billing and delivery address" },
  //{ href: "/dash/profile/data_privacy", icon: "bi-lock", text: "Data privacy", desc: "Now supportive data privacy" }
];

const ProfileBar = () => {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (href: any) => {
    setActiveLink(href);
  };

  return (
    <div className="flex flex-col w-full sm:w-[30%] p-5 bg-white border-t border-r border-slate-100">
      
      <div className="flex flex-col space-y-2 mt-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={""}
            className={`flex flex-nowrap items-center text-base sm:text-sm md:text-base px-2 py-3 duration-300 rounded-md ${
              activeLink === link.href ? "bg-slate-100" : "bg-slate-100"
            }`}
            onClick={() => handleLinkClick(link.href)}
          >
            <i className={`bi ${link.icon} text-base sm:text-lg mr-5 bg-slate-50 px-2 py-1 rounded-full`}></i>
            <span className="text-sm">
              <h4 className="text-gray-700 font-semibold">{link.text}</h4>
              <span className="text-xs text-slate-400">{link.desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileBar;
