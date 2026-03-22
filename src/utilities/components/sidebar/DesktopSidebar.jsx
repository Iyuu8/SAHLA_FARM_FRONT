import React from 'react'
import { Link } from 'react-router'
import { useLocation } from 'react-router';
import Tooltip from './Tooltip';




export default function DesktopSidebar({ userName = "user", LogOutIcon , NotificationIcon , HistoryIcon , HomeIcon , CameraIcon , ChatIcon , LogoIcon ,ProfileIcon}) {
  const location = useLocation();
  const navItems = [
  { name: "Home",          path: "/",              icon: HomeIcon         },
  { name: "Chat AI",       path: "/chat",          icon: ChatIcon         },
  { name: "Camera",        path: "/stream",        icon: CameraIcon       },
  { name: "History",       path: "/history",       icon: HistoryIcon      },
  { name: "Notifications", path: "/notifications", icon: NotificationIcon },
];

  return (
    <aside className="w-24 min-h-screen flex flex-col items-center py-5 overflow-visible" 
    style={{background: "linear-gradient(180deg, rgba(43, 32, 51, 1) 0%, rgba(28, 35, 42, 1) 100%)"}}>
      <div>
        <div className='mb-6'>
          <LogoIcon />
        </div>
        <div className='relative group flex flex-col items-center mb-8'>
          <Link
            to="/settings"
            className="flex flex-col items-center gap-2 mb-8 hover:opacity-80 transition-opacity text-gray-400"
          >
            <div className="w-14 h-14 rounded-full border-2 border-gray-500 flex items-center justify-center bg-[#D9D9D9]"
            style={location.pathname == "/settings" ? {
                          boxShadow: "0 0 12px 3px rgba(103, 191, 73, 1)",
                        } : {}}>
              <ProfileIcon />
            </div>
            <span className="text-[15px] text-gray-400 font-medium tracking-wide">
              {userName}
            </span>
          </Link>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-16 top-2  z-50 '><Tooltip title="Settings"/></div>
        </div>
        
      </div>
      <div className="flex flex-col items-center justify-between flex-1 w-full py-2">
          <nav className="flex flex-col items-center gap-3 w-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.name} className="relative group w-full flex justify-center">
                  <Link
                    to={item.path}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center
                      transition-all duration-200 bg-[#1A1A2E] text-white
                      ${isActive
                        ? ""
                        : "hover:text-gray-300"
                      }`}
                      style={isActive ? {
                        boxShadow: "0 0 12px 3px rgba(103, 191, 73, 1)",
                      } : {}}
                  >
                    <item.icon />
                  </Link>
                  <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-20 top-2  z-50'><Tooltip title={item.name}/></div>
                  
                </div>
              );
            })}
          </nav>
          <div className='relative group'>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-16 top-2  z-50 '><Tooltip title="Log Out"/></div>
            <button
              className="w-11 h-11 rounded-xl flex items-center justify-center
                border border-red-500/30 text-white
                hover:bg-red-500/10 hover:border-red-500/60
                transition-all duration-200 mt-auto"
                style={{boxShadow: "0 0 12px 3px rgba(226, 42, 73, 1)"}}
              onClick={() => alert("logout")}
            >
              
              <LogOutIcon />
            </button>
          </div>
           
      </div>
    </aside>
  )
}
