import React  , { useEffect , useRef} from 'react'
import { Link } from 'react-router'
import { useLocation } from 'react-router';
import Tooltip from './Tooltip';
import { useTranslation } from 'react-i18next';

import { clearProfileCache } from '../../../hooks/useProfileData.js'
//import useProfileInfo from '../../../hooks/useProfileInfo.js';
//import { NORMALIZED_USER } from '../../data/profileSettings';

import { supabase } from "../../../supabaseClient";
import { useNavigate } from 'react-router'



export default function DesktopSidebar({ profileInfo, LogOutIcon , NotificationIcon , HistoryIcon , HomeIcon , CameraIcon , ChatIcon , LogoIcon ,ProfileIcon}) {
  //const { profileInfo, updateProfileInfo, updateProfilePhoto } = useProfileInfo(NORMALIZED_USER);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navItems = [
  { name: t('sidebar.home'),          path: "/",              icon: HomeIcon         },
  { name: t('sidebar.chat'),       path: "/chat",          icon: ChatIcon         },
  { name: t('sidebar.camera'),        path: "/stream",        icon: CameraIcon       },
  { name: t('sidebar.history'),       path: "/history",       icon: HistoryIcon      },
  { name: t('sidebar.notifications'), path: "/notifications", icon: NotificationIcon },
  ];
  const asideRef = useRef(null)

    // Broadcast sidebar width to CSS variable whenever it changes
    useEffect(() => {
      const el = asideRef.current
      if (!el) return

      const updateWidth = () => {
        document.documentElement.style.setProperty('--sidebar-width', `${el.offsetWidth}px`)
      }

      updateWidth() // initial

      const ro = new ResizeObserver(updateWidth)
      ro.observe(el)
      return () => ro.disconnect()
    }, [profileInfo?.userName]) // re-check when username changes
  const navigate = useNavigate();
  const handleLogout = async () => {
  // Clear profile cache on logout
  clearProfileCache();
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Logout error:', error.message)
  navigate('/login')
}
  return (
    <aside
      ref={asideRef}
      className={`px-3 h-screen fixed ${isAr ? 'right-0' : 'left-0'} top-0 z-30 flex flex-col items-center py-5 overflow-visible min-w-[84px] w-max bg-sidebar-gradient`}

    >
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='mb-6'>
          <LogoIcon />
        </div>
        <div className='relative flex flex-col items-center '>
          <Link
            to="/settings"
            className="flex group flex-col items-center mb-8 hover:opacity-80 transition-opacity text-gray-400"
          >
            <div className="w-14 h-14 rounded-full border-2 border-gray-500 flex items-center justify-center bg-[#D9D9D9]"
            style={location.pathname === "/settings" ? {
                          boxShadow: "0 0 10px 0.5px rgba(103, 191, 73, 1)",
                        } : {}}>
              <ProfileIcon />
            </div>
            <span className="text-[15px] text-gray-400 font-medium tracking-wide">
              {profileInfo?.userName || ''}
            </span>
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute ${isAr ? "right-full " : "left-full "}   top-7 -translate-y-1/2 z-50`}>
              <Tooltip title={t('sidebar.settings')}/>
            </div>
          </Link>
          
        </div>
        
      </div>
      <div className="flex flex-col items-center justify-between flex-1 w-full py-2">
          <nav className="flex flex-col items-center gap-2 w-full">
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
                        boxShadow: "0 0 10px 0.5px rgba(103, 191, 73, 1)",
                      } : {}}
                  >
                    {isActive && (
                    <div className="absolute right-[calc(var(--sidebar-width)/2+6px)] w-1 h-3 bg-[#67BF49] rounded-r-[2px]" />
                  )}
                    <item.icon />
                    
                  </Link>
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute ${isAr ? "right-full " : "left-full "}   top-1/2 -translate-y-1/2 z-50`}>
                    <Tooltip title={item.name}/>
                  </div>
                  
                </div>
              );
            })}
          </nav>
          <div className='relative group'>
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute ${isAr ? "right-full mr-2" : "left-full ml-2"}   top-1/2 -translate-y-1/2 z-50`}>
              <Tooltip title={t('sidebar.logout')}/>
            </div>            
            <button
              className="w-11 h-11 rounded-xl flex items-center justify-center
                border border-red-500/30 text-white
                hover:bg-red-500/10 hover:border-red-500/60
                transition-all duration-200 mt-auto"
                style={{boxShadow: "0 0 10px 0.5px rgba(226, 42, 73, 1)"}}
              onClick={handleLogout}
            >
              
              <LogOutIcon />
            </button>
          </div>
           
      </div>
    </aside>
  )
}
