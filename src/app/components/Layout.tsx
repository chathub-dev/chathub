import { Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { themeColorAtom } from '~app/state'
import Sidebar from './Sidebar'

function Layout() {
  const themeColor = useAtomValue(themeColorAtom)
  return (
    <main className="h-screen grid grid-cols-[auto_1fr]" style={{ backgroundColor: themeColor }}>
      <Sidebar />
      <div className="p-[15px] h-full overflow-hidden">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
