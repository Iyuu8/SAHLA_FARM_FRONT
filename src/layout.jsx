import { Outlet } from "react-router";
import { useState } from "react";
import { useLocation } from "react-router";
import Sidebar from "./utilities/components/sidebar/Sidebar.jsx";
import Header from "./utilities/components/header/Header.jsx";
import { createContext } from "react";
import useNotifications from "./hooks/useNotifications";

export const NotificationsContext = createContext(null);

export default function Layout() {
  const {
    notifications,
    setNotifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        error,
        markAsRead,
        markAllAsRead,
      }}
    >
      <div
        className={`flex font-newblack ${location.pathname === "/notifications" || "/history" ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        <div className="">
          <Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
        </div>
        <div
          className={`md:pl-[88px] flex flex-col flex-1 p-2 h-screen bg-[#F5F7F6] bg-opacity-95 ${location.pathname === "/notifications" || "/history" ? "overflow-hidden" : ""}`}
        >
          <header className="w-full h-16 text-white flex items-center justify-start md:px-[2px] gap-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-black w-5 h-5 p-1 flex items-center"
            >
              ☰
            </button>
            <Header />
          </header>
          <main
            className={`flex flex-1 ${location.pathname === "/notifications" ? "overflow-y-auto" : "min-h-0"}`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationsContext.Provider>
  );
}
