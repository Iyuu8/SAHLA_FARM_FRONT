import React, { useState } from 'react'
import { Link } from 'react-router'
import { useLocation } from 'react-router';
import Tooltip from './Tooltip';
import { X } from "lucide-react"




export default function MobileSidebar({isOpen, setIsOpen , userName = "user" , LogOutIcon , NotificationIcon , HistoryIcon , HomeIcon , CameraIcon , ChatIcon , LogoIcon ,ProfileIcon}) {
  const location = useLocation();
  const navItems = [
  { name: "Home",          path: "/",              icon: HomeIcon         },
  { name: "Chat AI",       path: "/chat",          icon: ChatIcon         },
  { name: "Camera",        path: "/stream",        icon: CameraIcon       },
  { name: "History",       path: "/history",       icon: HistoryIcon      },
  { name: "Notifications", path: "/notifications", icon: NotificationIcon },
];
  return (
    <>
      
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
      <aside className={`fixed top-0 left-0 h-screen z-50 flex flex-col px-2 gap-2 py-2
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}  
            style={{background: "linear-gradient(180deg, rgba(43, 32, 51, 1) 0%, rgba(28, 35, 42, 1) 100%)",width: "260px",}}>
          <div className='flex items-center justify-between w-full mb-3'>
            <LogoIcon />
            {isOpen && <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8  flex items-center justify-center bg-transparent text-white
                hover:bg-white/10 rounded-xl
                transition-all duration-200"
            >
              <X size={20} />
            </button>}
          </div>
        
          
        
            <Link 
              onClick={() => setIsOpen(false)}
              to="/settings"
              className="flex justify-start items-center gap-2 mb-8 hover:opacity-80 transition-opacity text-gray-400"
              
            >
              <div className="w-14 h-14 rounded-full border-2 border-gray-500 flex items-center justify-center bg-[#D9D9D9]"
                style={location.pathname === "/settings" ? {
                          boxShadow: "0 0 12px 3px rgba(103, 191, 73, 1)",
                        } : {}}
              >
                <ProfileIcon />
              </div>
              <span className="text-[15px] text-gray-400 font-medium tracking-wide text-center">
                {userName} in Mobile
              </span>
            </Link>
        <div className="flex flex-col justify-between items-start flex-1 w-full py-2">
            <nav className="flex flex-col gap-3 w-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                console.log(location.pathname)
                return (
                    <Link 
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className='flex items-center group justify-start gap-3 px-4 w-fit'
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                        transition-all duration-200 bg-[#1A1A2E] text-white
                        ${isActive
                          ? ""
                          : "group-hover:text-gray-300"
                        }`}
                        style={isActive ? {
                          boxShadow: "0 0 12px 3px rgba(103, 191, 73, 1)",
                        } : {}}><item.icon /> </div>
                        <span className={`text-white ${isActive ? "" : "group-hover:text-gray-300"}`}>
                          {item.name}
                        </span>
                      
                    </Link>
                );
              })}
            </nav>
            <div className='flex items-center group justify-start gap-3 px-4' onClick={() => alert("logout")}>
              <button
                className="w-11 h-11 rounded-xl flex items-center justify-center
                  border border-red-500/30 text-white
                  hover:bg-red-500/10 hover:border-red-500/60
                  transition-all duration-200 mt-auto"
                  style={{boxShadow: "0 0 12px 3px rgba(226, 42, 73, 1)"}}
                
              >
                
                <LogOutIcon />
              </button>
              <span className='text-white group-hover:cursor-pointer'>
                  Log Out
              </span>
            </div>
            
        </div>
      </aside>
    </>
  )
}
