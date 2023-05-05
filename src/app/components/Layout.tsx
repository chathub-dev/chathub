import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <main className="h-screen grid grid-cols-[auto_1fr] bg-[rgb(var(--color-primary-purple))]">
      <Sidebar />
      <div className="p-[15px] h-full overflow-hidden">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
