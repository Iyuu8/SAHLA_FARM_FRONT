import { Outlet } from 'react-router'
import { useState } from 'react';
import Sidebar from "./utilities/components/sidebar/Sidebar.jsx"
import Header from './utilities/components/header/Header.jsx';

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className='flex min-h-screen'>
        
        <div><Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen}/></div>
        <div className='flex flex-col flex-1 bg-[#ECEEED] p-2'>
          <header className='w-full h-16  text-white flex items-center justify-start px-[2px] gap-1 '>
          
            
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-black text-xl p-1 flex items-center"
            >
              ☰
            </button>

            <Header></Header>

          </header>
          <main className='flex-1'>
            <Outlet/>
        </main>
        </div>
        
    </div>
  )
}
