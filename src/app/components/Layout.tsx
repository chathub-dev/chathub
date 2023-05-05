import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="bg-[rgb(var(--color-primary-purple))] h-screen py-3 px-3">
      <main className="grid grid-cols-[auto_1fr] h-full bg-primary-background bg-opacity-40 backdrop-blur-xl rounded-[25px] max-w-[1750px] mx-auto py-4 pr-4">
        <Sidebar />
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
