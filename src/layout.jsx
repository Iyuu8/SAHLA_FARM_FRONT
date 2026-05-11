import { Outlet } from "react-router";
import { useState } from "react";
import { useLocation } from "react-router";
import Sidebar from "./utilities/components/sidebar/Sidebar.jsx";
import Header from "./utilities/components/header/Header.jsx";
import { createContext } from "react";
import { useNotificationCount } from "./hooks/useNotificationCount";
import { useTranslation } from "react-i18next";

export const NotificationsContext = createContext(null);

export default function Layout() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const {
    count: notificationCount,
    loading: notificationCountLoading,
    error: notificationCountError,
    refetch: refetchNotificationCount,
    decrement: decrementCount,
  } = useNotificationCount();

  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <NotificationsContext.Provider
      value={{
        notificationCount,
        notificationCountLoading,
        notificationCountError,
        refetchNotificationCount,
        decrementCount,
      }}
    >
      <div
        className={`flex font-newblack ${location.pathname === "/notifications" || "/history" ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        <div className="">
          <Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
        </div>
        <div
          className={`${isAr ? "mr-[var(--sidebar-width)]" : "ml-[var(--sidebar-width)]"} flex flex-col flex-1 min-w-0 p-2 h-screen bg-[#F5F7F6] bg-opacity-95 ${
            location.pathname === "/notifications" || location.pathname === "/history"
              ? "overflow-hidden"
              : ""
          }}`}
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
            className={`flex flex-1 min-w-0 overflow-x-hidden ${
              location.pathname === "/notifications" ? "overflow-y-auto" : "min-h-0"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationsContext.Provider>
  );
}