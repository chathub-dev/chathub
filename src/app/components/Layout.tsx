import { Outlet } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { followArcThemeAtom, themeColorAtom } from '~app/state'
import DiscountModal from './Premium/DiscountModal'
import Sidebar from './Sidebar'
import PremiumModal from './Premium/Modal'

function Layout() {
  const themeColor = useAtomValue(themeColorAtom)
  const followArcTheme = useAtomValue(followArcThemeAtom)
  return (
    <main
      className="h-screen grid grid-cols-[auto_1fr]"
      style={{ backgroundColor: followArcTheme ? 'var(--arc-palette-foregroundPrimary)' : themeColor }}
    >
      <Sidebar />
      <div className="px-[15px] py-3 h-full overflow-hidden">
        <Outlet />
      </div>
      <DiscountModal />
      <PremiumModal />
    </main>
  )
}

export default Layout
