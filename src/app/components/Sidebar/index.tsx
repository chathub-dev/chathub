import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import GuideModal from '../GuideModal'
import ThemeSettingModal from '../ThemeSettingModal'
import Tooltip from '../Tooltip'
import NavLink from './NavLink'
import PremiumEntry from './PremiumEntry'
import { useEnabledBots } from '~app/hooks/use-enabled-bots'

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
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const [themeSettingModalOpen, setThemeSettingModalOpen] = useState(false)
  const enabledBots = useEnabledBots()
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
        {enabledBots.map(({ botId, bot }) => (
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
            <PremiumEntry text={t('Premium')} />
          </div>
        )}
        <div className={cx('flex mt-5 gap-[10px] mb-4', collapsed ? 'flex-col' : 'flex-row ')}>
          <Tooltip content={t('Feedback')}>
            <a href="https://github.com/wong2/chathub/issues" target="_blank" rel="noreferrer">
              <IconButton icon={feedbackIcon} />
            </a>
          </Tooltip>
          <Tooltip content={t('Settings')}>
            <Link to="/setting">
              <IconButton icon={settingIcon} />
            </Link>
          </Tooltip>
          <Tooltip content={t('Theme')}>
            <a onClick={() => setThemeSettingModalOpen(true)}>
              <IconButton icon={themeIcon} />
            </a>
          </Tooltip>
        </div>
      </div>
      <CommandBar />
      <GuideModal />
      {themeSettingModalOpen && <ThemeSettingModal open={true} onClose={() => setThemeSettingModalOpen(false)} />}
    </aside>
  )
}

export default Sidebar
