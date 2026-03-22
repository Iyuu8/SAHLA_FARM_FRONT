import React from 'react'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className='font-newblack'>
        <header>header</header>
        <div>sidebar</div>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}
