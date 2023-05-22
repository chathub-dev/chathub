import { Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { followArcThemeAtom, themeColorAtom } from '~app/state'
import Sidebar from './Sidebar'

function Layout() {
  const themeColor = useAtomValue(themeColorAtom)
  const followArcTheme = useAtomValue(followArcThemeAtom)
  return (
    <main
      className="min-h-screen grid grid-cols-[auto_1fr]"
      style={{ backgroundColor: followArcTheme ? 'var(--arc-palette-foregroundPrimary)' : themeColor }}
    >
      <Sidebar />
      <div className="p-[15px] h-full overflow-hidden">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
