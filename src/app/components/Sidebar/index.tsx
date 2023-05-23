import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { useAtom } from 'jotai'
import allInOneIcon from '~/assets/all-in-one.svg'
import collapseIcon from '~/assets/icons/collapse.svg'
import feedbackIcon from '~/assets/icons/feedback.svg'
import settingIcon from '~/assets/icons/setting.svg'
import themeIcon from '~/assets/icons/theme.svg'
import logo from '~/assets/logo.svg'
import minimalLogo from '~/assets/minimal-logo.svg'
import { CHATBOTS } from '~app/consts'
import { sidebarCollapsedAtom } from '~app/state'
import CommandBar from '../CommandBar'
import RatingModal from '../RatingModal'
import NavLink from './NavLink'
import PremiumEntry from './PremiumEntry'
import ThemeSettingModal from '../ThemeSettingModal'
import { useState } from 'react'

function IconButton(props: { icon: string; onClick?: () => void }) {
  return (
    <div
      className="p-[6px] rounded-[10px] w-fit cursor-pointer hover:opacity-80 bg-secondary dark:bg-transparent bg-opacity-20"
      onClick={props.onClick}
    >
      <img src={props.icon} className="w-6 h-6" />
    </div>
  )
}

function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const [themeSettingModalOpen, setThemeSettingModalOpen] = useState(false)
  return (
    <aside
      className={cx(
        'flex flex-col bg-primary-background bg-opacity-40 overflow-hidden',
        collapsed ? 'items-center px-[15px]' : 'w-[230px] px-4',
      )}
    >
      <img
        src={collapseIcon}
        className={cx('w-6 h-6 cursor-pointer my-5', collapsed ? 'rotate-180' : 'self-end')}
        onClick={() => setCollapsed((c) => !c)}
      />
      {collapsed ? <img src={minimalLogo} className="w-[30px]" /> : <img src={logo} className="w-[79px]" />}
      <div className="flex flex-col gap-3 mt-12 overflow-y-auto scrollbar-none">
        <NavLink to="/" text={'All-In-One'} icon={allInOneIcon} iconOnly={collapsed} />
        {Object.entries(CHATBOTS).map(([botId, bot]) => (
          <NavLink
            key={botId}
            to="/chat/$botId"
            params={{ botId }}
            text={bot.name}
            icon={bot.avatar}
            iconOnly={collapsed}
          />
        ))}
      </div>
      <div className="mt-auto pt-2">
        {!collapsed && <hr className="border-[#ffffff4d]" />}
        {!collapsed && (
          <div className="my-5">
            <PremiumEntry text="Premium" />
          </div>
        )}
        <div className={cx('flex mt-5 gap-[10px] mb-4', collapsed ? 'flex-col' : 'flex-row ')}>
          <a href="https://github.com/wong2/chathub/issues" target="_blank" rel="noreferrer" title="Feedback">
            <IconButton icon={feedbackIcon} />
          </a>
          <Link to="/setting">
            <IconButton icon={settingIcon} />
          </Link>
          <IconButton icon={themeIcon} onClick={() => setThemeSettingModalOpen(true)} />
        </div>
      </div>
      <CommandBar />
      <RatingModal />
      {themeSettingModalOpen && <ThemeSettingModal open={true} onClose={() => setThemeSettingModalOpen(false)} />}
    </aside>
  )
}

export default Sidebar
