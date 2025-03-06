"use client"

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TopBarProps {
    page: String
}
 interface Analytics {
    sales: number;
    customers: number;
    revenue: number;
  }
  const formatNumber = (amount: number | any, count: number): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: count,
        maximumFractionDigits: count,
    }).format(amount);
  };
  interface Session{
    id: string;
    name: string;
    session_id: string;
    profile: string;
  }

const TopBar = ({page}: TopBarProps) => {
        const [analytics, setAnalytics] = useState<Analytics | null>(null);
        const [userInitials, setUserInitials] = useState<string | null>(null);
        const [isOpen, setIsOpen] = useState(false);
        const [sessionData, setSessionData] = useState<Session | null>(null);
         const router = useRouter();

    useEffect(() => {
         const loadUserSession = () => {
            const userSession = JSON.parse(localStorage.getItem('adminSession') || '{}');
            if (userSession && userSession.name) {
              setSessionData(userSession);
              const initials = userSession.name.split(" ").map((part: string) => part[0]).join('').toUpperCase();
              setUserInitials(initials);
            }
          };
     loadUserSession();
   }, []);
             // Fetch SalesSummary
             useEffect(() => {
               const fetchSalesSummary = async () => {
                 try {
                   const response = await fetch(`/api/analytics/sales_summary`);
                   if (!response.ok) throw new Error("Failed to fetch sales summary");
                   const data = await response.json();
                   setAnalytics(data);
                 } catch (error) {
                   console.log("An error occurred while fetching sales summary.");
                 }
               };
               fetchSalesSummary();
             }, []);
    return (
       <div className="w-full flex justify-between items-center">
         <h1 className="text-2xl ">{page}</h1>
         <div className="flex items-center space-x-7">
            <div className="flex min-w-[50vh] py-2 px-4 text-slate-400 border-y border-amber-400 rounded-md text-sm space-x-3">
                <div className="flex items-center space-x-1">
                    <span>Sales: </span>
                    <span>{formatNumber(analytics?.sales, 0)}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>Customers: </span>
                    <span>{formatNumber(analytics?.customers, 0)}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>Revenue: </span>
                    <span>{formatNumber(analytics?.revenue, 2)} RWF</span>
                </div>
               
            </div>
            <div className="flex py-2 border rounded-full w-10 h-10 items-center justify-center cursor-pointer">
                <i className="bi bi-bell text-xl text-slate-500"></i>
                <span className="bg-red-500 w-2 h-2 rounded-full absolute ml-3 mt-[-12px]"></span>
            </div>
            <div className="flex py-2 border rounded-full w-10 h-10 items-center justify-center cursor-pointer">
                <i className="bi bi-chat-dots text-xl text-slate-500"></i>
                <span className="bg-red-500 w-2 h-2 rounded-full absolute ml-4 mt-[-10px]"></span>
            </div>
            <div className="">
            {userInitials ? (
              <div className="relative flex items-center bg-slate-100 rounded-full p-1 cursor-pointer hover:bg-slate-200 transition-all duration-300" onClick={() => setIsOpen(!isOpen)}>
                <div className="bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg" style={{ width: '40px', height: '40px' }}>
                  {userInitials}
                </div>
                
                {isOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-40 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                    <ul className="flex flex-col py-2 px-3 space-y-2">
                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-gear mr-2 text-lg text-sky-500"></i>
                        <Link href="/acoount" onClick={() => redirect("/i/account")} className="text-gray-700 hover:text-green-500 transition-colors">Settings</Link>
                      </li>
                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-box-arrow-left mr-2 text-lg text-orange-500"></i>
                        <Link href="/logout" onClick={() => redirect("/logout")} className="text-gray-700 hover:text-orange-500 transition-colors">Logout</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link href={"/auth/login"} className="flex py-2 border rounded-full w-10 h-10 items-center justify-center cursor-pointer">
                <i className="bi bi-person text-xl text-slate-500"></i>
                
              </Link>
            )}
          </div>
          
         </div>
       </div>
       
    );
}
export default TopBar;