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
import BotIcon from '../BotIcon'
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
  // ボットの情報を保持するための状態（インデックスベース）
  const [botNames, setBotNames] = useState<Record<number, string>>({})
  const [botShortNames, setBotShortNames] = useState<Record<number, string>>({})
  const [botAvatars, setBotAvatars] = useState<Record<number, string>>({})

// コンポーネントマウント時にアバター情報を含めて設定を取得
useEffect(() => {
  const initializeConfig = async () => {
    const config = await getUserConfig();
    if (config.customApiConfigs) {
      const newBotNames: Record<number, string> = {};
      const newBotShortNames: Record<number, string> = {};
      const newBotAvatars: Record<number, string> = {};

      config.customApiConfigs.forEach((apiConfig, index) => {
        newBotNames[index] = apiConfig.name;
        newBotShortNames[index] = apiConfig.shortName;
        newBotAvatars[index] = apiConfig.avatar;
      });

      setBotNames(newBotNames);
      setBotShortNames(newBotShortNames);
      setBotAvatars(newBotAvatars); // ステートを更新
      console.log('Sidebar useEffect: Updated bot states', { newBotNames, newBotShortNames, newBotAvatars }); // ログ追加
    }
  };

  initializeConfig();

}, []);


  useEffect(() => {
    Promise.all([getAppOpenTimes(), getPremiumModalOpenTimes(), checkReleaseNotes()]).then(
      async ([appOpenTimes, premiumModalOpenTimes, releaseNotes]) => {
        setReleaseNotes(releaseNotes)
      },
    )
  }, [])

  // ボット名を取得する関数（インデックスベース）
  const getBotDisplayName = (index: number) => {
    return botNames[index] ?? `Custom Bot ${index + 1}`;
  }

  // ボット略称を取得する関数（インデックスベース）
  const getBotShortDisplayName = (index: number) => {
    return botShortNames[index] ?? undefined;
  }
  
  // ボットアバターを取得する関数（インデックスベース）
  const getBotAvatar = (index: number) => {
    return botAvatars[index] ?? 'OpenAI.Black';
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
      {/* All-In-One link moved outside the scrollable div */}
      <div className="mt-10">
        <NavLink to="/" text={'All-In-One'} shortText={'A-One'} icon={allInOneIcon} iconOnly={collapsed} />
      </div>
      {/* Scrollable area for enabled bots */}
      <div className="flex flex-col gap-[13px] mt-2 overflow-y-auto scrollbar-none flex-grow"> {/* mt-10からmt-2へ変更し、flex-growを追加 */}
        {/* enabledBots の内容をログで確認  */}
        {(() => { console.log('Sidebar render: enabledBots', enabledBots); return null; })()}
        {enabledBots.map(({ index, bot }) => {
          return (
            <NavLink
              key={`custom-${index}`}
              to="/chat/custom/$index"
              params={{ index: index.toString() }}
              text={getBotDisplayName(index)}
              shortText={getBotShortDisplayName(index)}
              icon={getBotAvatar(index)}
              iconOnly={collapsed}
            />
          )
        })}
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
