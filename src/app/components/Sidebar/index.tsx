import { Link, LinkOptions } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import allInOneIcon from '~/assets/all-in-one.svg'
import collapseIcon from '~/assets/icons/collapse.svg'
import feedbackIcon from '~/assets/icons/feedback.svg'
import githubIcon from '~/assets/icons/github.svg'
import settingIcon from '~/assets/icons/setting.svg'
import themeIcon from '~/assets/icons/theme.svg'
import minimalLogo from '~/assets/icon.png'
import logo from '~/assets/logo.png'
import { cx } from '~/utils'
import { useEnabledBots } from '~app/hooks/use-enabled-bots'
import { releaseNotesAtom, showDiscountModalAtom, sidebarCollapsedAtom } from '~app/state'
import { checkReleaseNotes } from '~services/release-notes'
import * as api from '~services/server-api'
import { getAppOpenTimes, getPremiumModalOpenTimes } from '~services/storage/open-times'
import GuideModal from '../GuideModal'
import ThemeSettingModal from '../ThemeSettingModal'
import Tooltip from '../Tooltip'
import NavLink from './NavLink'
import PremiumEntry from './PremiumEntry'
import { getUserConfig } from '~services/user-config'
import { CHATBOTS } from '~app/consts'
import { BotId } from '~app/bots'


function IconButton(props: { icon: string; onClick?: () => void }) {
  return (
    <div
      className="p-[6px] rounded-[10px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20"
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
  const setReleaseNotes = useSetAtom(releaseNotesAtom)
  // ボットの名前を保持するための状態を追加
  const [botNames, setBotNames] = useState<Partial<Record<BotId, string>>>({}) 
  const [botShortNames, setBotShortNames] = useState<Partial<Record<BotId, string>>>({}) 
  // 必要なステートを追加
  const [botAvatars, setBotAvatars] = useState<Partial<Record<BotId, string>>>({})

// コンポーネントマウント時にアバター情報を含めて設定を取得
useEffect(() => {
  const initializeConfig = async () => {
    const config = await getUserConfig()
    if (config.customApiConfigs) {
      const newBotNames: Partial<Record<BotId, string>> = {}
      const newBotShortNames: Partial<Record<BotId, string>> = {}
      const newBotAvatars: Partial<Record<BotId, string>> = {}
      
      config.customApiConfigs.forEach((config, index) => {
        const botId = `customchat${index + 1}` as BotId
        newBotNames[botId] = config.name
        newBotShortNames[botId] = config.shortName
        newBotAvatars[botId] = config.avatar  // avatar情報を取得
      })

      setBotNames(newBotNames)
      setBotShortNames(newBotShortNames)
      setBotAvatars(newBotAvatars)  // ステートを更新
    }
  }

  initializeConfig()
}, [])

  // コンポーネントマウント時に設定を取得
  useEffect(() => {
    const initializeConfig = async () => {
      const config = await getUserConfig()
      // Custom APIの設定に基づいてボット名を更新
      if (config.customApiConfigs) {
        const newBotNames: Partial<Record<BotId, string>> = {}
        const newBotShortNames: Partial<Record<BotId, string>> = {}
        config.customApiConfigs.forEach((config, index) => {
          const botId = `customchat${index + 1}` as BotId // BotId型にキャスト
          newBotNames[botId] = config.name
          newBotShortNames[botId] = config.shortName
        })
        setBotNames(newBotNames)
        setBotShortNames(newBotShortNames)
      }
    }

    initializeConfig()
  }, [])

  useEffect(() => {
    Promise.all([getAppOpenTimes(), getPremiumModalOpenTimes(), checkReleaseNotes()]).then(
      async ([appOpenTimes, premiumModalOpenTimes, releaseNotes]) => {
        setReleaseNotes(releaseNotes)
      },
    )
  }, [])

  // ボット名を取得する関数
  const getBotDisplayName = (botId: BotId) => {
    // カスタムチャットボットの場合は状態から名前を取得
    if (botId.startsWith('customchat')) {
      return botNames[botId] ?? CHATBOTS[botId].name
    }
    // 通常のボットの場合はデフォルトの名前を使用
    return CHATBOTS[botId].name
  }

  // ボット略称を取得する関数
  const getBotShortDisplayName = (botId: BotId) => {
    // カスタムチャットボットの場合は状態から名前を取得
    if (botId.startsWith('customchat')) {
      return botShortNames[botId] ?? undefined
    }
    // 通常のボットの場合はundefined
    return undefined
  }
  
  // ボットアバターを取得する関数
  const getBotAvatar = (botId: BotId) => {
    // カスタムチャットボットの場合は状態からアバターを取得
    if (botId.startsWith('customchat')) {
      return botAvatars[botId] ?? CHATBOTS[botId].avatar
    }
    // 通常のボットの場合はデフォルトのアバターを使用
    return CHATBOTS[botId].avatar
  }


  return (
    <motion.aside
      className={cx(
        'flex flex-col bg-primary-background bg-opacity-40 overflow-hidden',
        collapsed ? 'items-center px-[2px]' : 'w-[230px] px-4',
      )}
    >
      <div className={cx('flex mt-8 gap-3 items-center', collapsed ? 'flex-col-reverse' : 'flex-row justify-between')}>
        {collapsed ? <img src={minimalLogo} className="w-[30px]" /> : <img src={logo} className="w-[140px] ml-2" />}
        <motion.img
          src={collapseIcon}
          className={cx('w-10 h-10 cursor-pointer')}
          animate={{ rotate: collapsed ? 180 : 0 }}
          onClick={() => setCollapsed((c) => !c)}
        />
      </div>
      <div className="flex flex-col gap-[13px] mt-10 overflow-y-auto scrollbar-none">
        <NavLink to="/" text={'All-In-One'} shortText={'A-One'} icon={allInOneIcon} iconOnly={collapsed} />
        {enabledBots.map(({ botId, bot }) => (
          <NavLink
            key={botId}
            to="/chat/$botId"
            params={{ botId }}
            text={getBotDisplayName(botId)}
            shortText={getBotShortDisplayName(botId)}
            icon={getBotAvatar(botId)}
            iconOnly={collapsed}
          />
        ))}
      </div>
      <div className="mt-auto pt-2">
        {!collapsed && <hr className="border-[#ffffff4d]" />}
        {!collapsed && (
          <div className="my-5">
            <PremiumEntry text={t('OpenSource')} />
          </div>
        )}
        <div className={cx('flex mt-5 gap-[10px] mb-4', collapsed ? 'flex-col' : 'flex-row ')}>
          {!collapsed && (
            <Tooltip content={t('GitHub')}>
              <a href="https://github.com/bondICha/chathub-OSS" target="_blank" rel="noreferrer">
                <IconButton icon={githubIcon} />
              </a>
            </Tooltip>
          )}
          {!collapsed && (
            <Tooltip content={t('Feedback')}>
              <a href="https://github.com/bondICha/chathub-OSS/issues" target="_blank" rel="noreferrer">
                <IconButton icon={feedbackIcon} />
              </a>
            </Tooltip>
          )}
          {!collapsed && (
            <Tooltip content={t('Display')}>
              <a onClick={() => setThemeSettingModalOpen(true)}>
                <IconButton icon={themeIcon} />
              </a>
            </Tooltip>
          )}
          <Tooltip content={t('Settings')}>
            <Link to="/setting">
              <IconButton icon={settingIcon} />
            </Link>
          </Tooltip>
        </div>
      </div>
      <GuideModal />
      <ThemeSettingModal open={themeSettingModalOpen} onClose={() => setThemeSettingModalOpen(false)} />
    </motion.aside>
  )
}

export default Sidebar
