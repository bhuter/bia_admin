import Profile from "../comps/nav/Profile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";


interface NavBarProps {
  menuCollapsed: boolean;
  toggleMenu: () => void;
  onNavigate: (page: string) => void; // Add onNavigate prop to trigger page change
}

const NavBar = ({ menuCollapsed, toggleMenu, onNavigate }: NavBarProps) => {
  const [currentPath, setCurrentPath] = useState(""); // Use state to track current path
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname); // Get current pathname from window object
    }
  }, [router]);

  useEffect(() => {
      const session = JSON.parse(localStorage.getItem("adminSession") || "null");
      setRole(session?.role);
  }, [role])

  const menu = [
    { name: "Dashboard", url: "/", icon: "bi bi-grid" },
    { name: "Delivery", url: "/i/delivery", icon: "bi bi-truck" },
    { name: "Orders", url: "/i/orders", icon: "bi bi-cart" },
    { name: "Products", url: "/i/products", icon: "bi bi-box-seam" },
    { name: "Payments", url: "/i/payments", icon: "bi bi-cash-coin" },
    /*{ name: "Finance", url: "/i/finance", icon: "bi bi-credit-card" },*/
    { name: "Promotions", url: "/i/promotion", icon: "bi bi-megaphone" },
    { name: "Customers", url: "/i/customers", icon: "bi bi-people" },
    { name: "Agents", url: "/i/agents", icon: "bi bi-person-workspace" },
  ];
  const tailors = [
    { name: "Students", url: "/tailors/students", icon: "bi bi-mortarboard" },
   /**  { name: "Programs ", url: "/tailors/programs", icon: "bi bi-box" },
    { name: "Calendar", url: "/tailors/schedules", icon: "bi bi-calendar" },
    { name: "Inbox", url: "/tailors/inbox", icon: "bi bi-chat" },
    { name: "Fees Management", url: "/tailors/fees", icon: "bi bi-file-earmark-bar-graph" },
  */
   ];
  const others = [
    { name: "Account", url: "/i/account", icon: "bi bi-gear" },
    { name: "Log out", url: "/auth/logout", icon: "bi bi-box-arrow-left" },
  ];

  return (
    <>
      <Profile menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className="navbar-container max-h-[85vh] overflow-hidden mx-2 mt-3">
        <h4 className="text-gray-600 text-md">MENU</h4>
        <div className="py-1 flex flex-col">
  {menu.map((tab, index) => {
    const isAdminTab = ['Agents', 'Orders', 'Promotions', 'Customers'].includes(tab.name);
    const shouldRender =
      role === 'admin' || (!isAdminTab && tab.name !== '');

    if (!shouldRender) return null;

    return (
      <Link
        key={index}
        href={tab.url}
        onClick={() => onNavigate(tab.name)} // Update the page name on navigation
        className={`flex items-center py-2 px-3 text-gray-500 text-sm rounded-md hover:bg-slate-100 hover:text-gray-900 transition-all duration-300 ${
          pathname === tab.url ? 'bg-slate-200 text-gray-900' : ''
        }`}
      >
        <i className={`${tab.icon} mr-2 text-xl transition-all duration-300 hover:text-sky-500`}></i>
        <span
          className={`${
            menuCollapsed ? 'hidden' : 'block'
          } transition-all duration-300 sm:block md:block lg:block`}
        >
          {tab.name}
        </span>
      </Link>
    );
  })}
</div>

        <h4 className="text-gray-600 text-md border-t py-2 mt-3">TAILORS COLLEGE</h4>
        <div className="py-1 flex flex-col">
          {tailors.map((tab, index) => (
            <Link
              key={index}
              href={tab.url}
              onClick={() => onNavigate(tab.name)} // Update the page name on navigation
              className={`flex items-center py-2 px-3 text-gray-500 text-sm rounded-md hover:bg-slate-100 hover:text-gray-900 transition-all duration-300 ${
                currentPath === tab.url ? 'bg-slate-200 text-gray-900' : ''
              }`}
            >
              <i className={`${tab.icon} mr-1 text-xl transition-all duration-300 hover:text-sky-500`}></i>
              <span className={`${menuCollapsed ? 'hidden' : 'block'} sm:block md:block lg:block transition-all duration-300`}>
                {tab.name}
              </span>
            </Link>
          ))}
        </div>

        <h4 className="text-gray-600 text-md border-t py-2 mt-3">SETTINGS</h4>
        <div className="py-1 flex flex-col">
          {others.map((tab, index) => (
            <Link
              key={index}
              href={tab.url}
              onClick={() => onNavigate(tab.name)} // Update the page name on navigation
              className={`flex items-center py-2 px-3 text-gray-500 text-sm rounded-md hover:bg-slate-100 hover:text-gray-900 transition-all duration-300 ${
                currentPath === tab.url ? 'bg-slate-200 text-gray-900' : ''
              }`}
            >
              <i className={`${tab.icon} mr-1 text-xl transition-all duration-300 hover:text-sky-500`}></i>
              <span className={`${menuCollapsed ? 'hidden' : 'block'} sm:block md:block lg:block transition-all duration-300`}>
                {tab.name}
              </span>
            </Link>
          ))}
        </div>
       
       
      </div>
    </>
  );
};

export default NavBar;
