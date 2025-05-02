"use client";
import { useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./pages/navBar";
import TopBar from "./comps/nav/TopBar";
import "../app/styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface RootLayoutProps {
  children: ReactNode;
}
const manipulateUrl = (url: string) => {
  // Remove the '/i/' prefix
  if (url.startsWith('/i/')) {
      url = url.replace('/i/', '');
  }else if(url.startsWith('/tailors/')){
    url = url.replace('/tailors/', '');
  }else{
    url = "dashboard"; 
  }

  // Capitalize the first letter of the remaining word
  const capitalized = url.charAt(0).toUpperCase() + url.slice(1);

  return capitalized;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const path = usePathname();
  const pathTitle = manipulateUrl(path);
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>(pathTitle); // State for dynamic page title

  const toggleMenu = () => {
    setMenuCollapsed((prev) => !prev);
  };

  const sidebarWidth = menuCollapsed ? '80px' : '260px';
  const mainMarginLeft = menuCollapsed ? '80px' : '270px';

  // Function to update page title when navigating
  const handlePageChange = (newPage: string) => {
    setPageTitle(newPage);
  };
  const router = useRouter();
   useEffect(() => {
      const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
      
      if (!session) {
         router.push("/auth/login");
      }
    }, [router])

  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
        <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
      </head>
      <body className="bg-slate-50 transition-all duration-300 ease-in-out">
        {/* Sidebar - Fixed */}
        <nav
          className={`fixed top-0 h-full bg-white border border-slate-200 shadow p-3 z-10 transition-all duration-300`}
          style={{ width: sidebarWidth }}
        >
          <NavBar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} onNavigate={handlePageChange} />
        </nav>

        {/* Main Content */}
        <main
          className="min-h-screen py-2 transition-all duration-300"
          style={{ marginLeft: mainMarginLeft }}
        >
          {/* TopBar - Fixed */}
          <div
            className="fixed top-0 z-20 p-4 flex justify-between bg-white shadow-sm"
            style={{
              left: sidebarWidth,
              width: `calc(100% - ${sidebarWidth})`,
            }}
          >
            <TopBar page={pageTitle} />
          </div>

          {/* Main Content */}
          <div className="mt-[80px] mr-2 py-2 px-2 rounded-lg">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
