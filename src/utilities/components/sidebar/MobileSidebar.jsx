import { Link } from 'react-router'
import { useLocation } from 'react-router';
import { X } from "lucide-react"
import { useTranslation } from 'react-i18next';

import useProfileInfo from '../../../hooks/useProfileInfo.js';
import { NORMALIZED_USER } from '../../data/profileSettings';

import { supabase } from "../../../supabaseClient";
import { useNavigate } from 'react-router'


export default function MobileSidebar({isOpen, setIsOpen , userName = "user" , LogOutIcon , NotificationIcon , HistoryIcon , HomeIcon , CameraIcon , ChatIcon , LogoIcon ,ProfileIcon}) {
  const { profileInfo, updateProfileInfo, updateProfilePhoto } = useProfileInfo(NORMALIZED_USER);
  
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navItems = [
  { name: "Home",          path: "/",              icon: HomeIcon         },
  { name: "Chat AI",       path: "/chat",          icon: ChatIcon         },
  { name: "Camera",        path: "/stream",        icon: CameraIcon       },
  { name: "History",       path: "/history",       icon: HistoryIcon      },
  { name: "Notifications", path: "/notifications", icon: NotificationIcon },
  ];
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
    navigate('/login');
  };
  return (
    <>
      
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
      <aside className={`fixed top-0 left-0 h-screen z-50 flex flex-col gap-2 py-3
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}  
            style={{background: "linear-gradient(180deg, rgba(43, 32, 51, 1) 0%, rgba(28, 35, 42, 1) 100%)",maxWidth:"160px"}}>
          <div className='flex items-center justify-between mb-3 px-2'>
            <div className="w-14 h-14 flex items-center justify-center">
              <LogoIcon />
            </div>
            {isOpen && <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8  flex items-center justify-center bg-transparent text-white
                hover:bg-white/10 rounded-xl
                transition-all duration-200"
            >
              <X size={25} />
            </button>}
          </div>
        
          
        
          <Link
            onClick={() => setIsOpen(false)}
            to="/settings"
            className="flex justify-start w-full items-center mb-8 px-2 hover:opacity-80 transition-opacity gap-2"
          >
            <div className={`w-14 h-14 border-2 border-gray-500 bg-[#D9D9D9] rounded-full
              flex items-center justify-center
              ${location.pathname === "/settings" ? "shadow-[0_0_12px_0.5px_rgba(103,191,73,1)]" : ""}
            `}>
              <ProfileIcon />
            </div>
            <span className="text-[15px] text-gray-400 font-medium tracking-wide text-center">
              {profileInfo.userName}
            </span>
          </Link>
        <div className="flex flex-col justify-between items-start flex-1 w-full py-2 ">
            <nav className="flex flex-col items-start justify-start gap-3 w-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-start group justify-start gap-3 px-3 w-full py-1
                        ${isActive
                          ? "bg-[#1A1A2E] opacity-67"
                          : ""
                        }
                        `}
                    >
                      <div className={` text-white
                        ${isActive
                          ? ""
                          : "group-hover:text-gray-300"
                        }`}
                        ><item.icon /></div>
                        <span className={`text-white ${isActive ? "" : "group-hover:text-gray-300"}`}>
                          {item.name}
                        </span>
                      
                    </Link>
                );
              })}
            </nav>
            <div className='flex items-center justify-center px-2 w-full' >
              <button
                onClick={handleLogout}
                className="m-auto rounded-xl flex items-center justify-center px-2 py-2 gap-2 w-full bg-red-600
                 text-white
                  transition-all duration-200 mt-auto"
                  style={{boxShadow: "0 0 10px 0.5px rgba(226, 42, 73, 1)"}}
                
              >
                
                <LogOutIcon />
                <span className='text-white group-hover:cursor-pointer'>
                  {t('sidebar.logout')}
                </span>
              </button>
              
            </div>
            
        </div>
      </aside>
    </>
  )
}
