import { Outlet } from 'react-router'
import { useState } from 'react';
import { useLocation } from 'react-router';
import Sidebar from "./utilities/components/sidebar/Sidebar.jsx"
import Header from './utilities/components/header/Header.jsx';
import { notificationsData } from './utilities/data/notificationsData.js';
import { createContext } from 'react';

export const NotificationsContext = createContext(null);

export default function Layout() {
  const [notifications, setNotifications] = useState(notificationsData);
  
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    
    <NotificationsContext.Provider value={{notifications,setNotifications}}>
      <div className='flex min-h-screen font-newblack'>
          
          <div className=''><Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen}/></div>
          <div className={`md:pl-[88px] flex flex-col flex-1 p-2 h-screen bg-[#F5F7F6]
          `}>
            <header className='w-full h-16  text-white flex items-center justify-start md:px-[2px] gap-1 '>
            
              
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden text-black w-5 h-5 p-1 flex items-center"
              >
                ☰
              </button>

            <Header></Header>

          </header>
          <main className={`flex flex-1  ${location.pathname === "/notifications" ? "overflow-y-auto" : ""}`}>
            <Outlet/>
          </main>
        </div>
          
      </div>
    </NotificationsContext.Provider>
  )
}
