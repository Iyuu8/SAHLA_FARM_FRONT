import { Outlet } from 'react-router'
import { useState } from 'react';
import Sidebar from "./utilities/components/sidebar/Sidebar.jsx"

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className='flex min-h-screen'>
        
        <div><Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen}/></div>
        <div className='flex flex-col flex-1'>
          <header className='w-full h-16 bg-gray-800 text-white flex items-center justify-start px-6 gap-4'>
          
            
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-white text-xl p-1"
            >
              ☰
            </button>

            <span>Header</span>

          </header>
          <main className='flex-1'>
            <Outlet/>
        </main>
        </div>
        
    </div>
  )
}
