"use client"

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface TopBarProps {
    page: String
}
 interface Analytics {
    sales: number;
    customers: number;
    revenue: number;
  }

  interface Notification  {
    id: number;
    content_text: string;
    event: string;
    action_required: string;
    created_at: string;
    admin: string  | null; 
    view: string | null;
    first_name: string;
    last_name: string;
    mailed: string;
    sms: string;
    phone: string;
    email: string;

  };
  
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

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const prefix = Number(hours) >= 12 ? 'PM' : 'AM';

  return `${month}, ${day} ${year} ${hours}:${minutes} ${prefix}`;
};

const TopBar = ({page}: TopBarProps) => {
        const [analytics, setAnalytics] = useState<Analytics | null>(null);
        const [userInitials, setUserInitials] = useState<string | null>(null);
        const [isOpen, setIsOpen] = useState(false);
        const [sessionData, setSessionData] = useState<Session | null>(null);
        const [showNotifications, setShowNotifications] = useState(false);
        const [notifications, setNotifications] = useState<Notification[]>([]); 

        const wrapperRef = useRef(null);
  
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

             const fetchNotifications = useCallback(async () => {
              try {
               
                  const res = await fetch(`/api/auth/notification`);
                  const data = await res.json();
                  setNotifications(Array.isArray(data) ? data : []);
                
              } catch (err) {
                console.error("Failed to load notifications:", err);
                setNotifications([]); // fallback to empty array on error
              }
            }, []);

            const updateNotifications = async () => {
              try {

                  const res = await fetch(`/api/auth/notification/update`);
                  if (res.ok) {
                    console.log("Notifications updated");
                 }
              } catch (err) {
                console.error("Failed to trigger update job:", err);
              }
            };
      
  useEffect(() => {
    // Initial calls
    fetchNotifications();

    // Set interval to repeat every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1000 * 30); // 2000ms = 2 seconds

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => { 
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
        updateNotifications();
        setShowNotifications(false);
        
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => n.admin === "Unread").length
  : 0;        
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
            {/***/}
            <div className="relative">
                      <div className="flex py-2 border rounded-full w-10 h-10 items-center justify-center cursor-pointer" onClick={() => setShowNotifications((prev) => !prev)}>
                        <i className="bi bi-bell text-xl text-slate-500"></i>
                        {unreadCount > 0 && (
                          <span className="absolute w-4 h-4 text-center bg-red-400 text-white rounded-full ml-4 -mt-3 text-[10px] ">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {/* Notification Dropdown */}
          {showNotifications && (
            <div
              ref={wrapperRef}
              className="absolute sm:-right-20 w-72 mt-2 bg-white shadow-lg rounded-lg p-3 border border-orange-300"
            >
              <div className="text-sm font-semibold text-gray-700">
                Notifications
              </div>
              <ul className="max-h-96 overflow-y-auto divide-y divide-neutral-300">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <li key={n.id}
                      className={`py-3 px-4 hover:bg-neutral-100 cursor-pointer space-y-1 text-sm ${
                      n.admin === "Unread" ? "font-semibold text-gray-700" : "text-neutral-500"
                      }`}
                    >
                      <div className="text-emerald-700">{n.event}</div>
                      <div>{n.content_text}</div>
                      {/* Customer details */}
                      <div className="text-xs text-gray-600 mt-1">
                       {n.first_name} {n.last_name} — {n.phone} — {n.email}
                      </div>
                       {/* Status icons */}
                      <div className="flex space-x-3 mt-1">
                        <i className={`bi ${n.view === "Unread" ? "bi-eye-slash text-red-500" : "bi-eye text-green-500"}`} title={n.view === "Unread" ? "Unread" : "Read"}></i>
                        <i className={`bi ${n.mailed ? "bi-envelope-check text-blue-500" : "bi-envelope text-gray-400"}`} title={n.mailed ? "Mailed" : "Not mailed"}></i>
                        <i className={`bi ${n.sms ? "bi-chat-dots text-purple-500" : "bi-chat text-gray-400"}`} title={n.sms ? "SMS sent" : "No SMS"}></i>
                      </div>

                      <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
    <span className="text-orange-900">{formatDate(n.created_at)}</span>
    <a
      href={n.action_required || "/dash/"}
      className="border-b border-emerald-800 px-2 py-[2px] rounded-dull text-emerald-700 flex justify-self-end"
      target="_blank"
    >
      View
    </a>
  </div>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500 text-center">No notifications</li>
                )}
              </ul>
            </div>
          )}
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
                        <Link href="/i/account" onClick={() => redirect("/i/account")} className="text-gray-700 hover:text-green-500 transition-colors">Settings</Link>
                      </li>
                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-box-arrow-left mr-2 text-lg text-orange-500"></i>
                        <Link href="/auth/logout" onClick={() => redirect("/logout")} className="text-gray-700 hover:text-orange-500 transition-colors">Logout</Link>
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