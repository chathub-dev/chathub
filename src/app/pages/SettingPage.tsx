import { Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiExport, BiImport } from 'react-icons/bi'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import Select from '~app/components/Select'
import ChatGPTAPISettings from '~app/components/Settings/ChatGPTAPISettings'
import KDB from '~app/components/Settings/KDB'
import { ALL_IN_ONE_PAGE_ID, CHATBOTS } from '~app/consts'
import { usePremium } from '~app/hooks/use-premium'
import { exportData, importData } from '~app/utils/export'
import {
  BingConversationStyle,
  ChatGPTMode,
  MultiPanelLayout,
  PoeModel,
  UserConfig,
  getUserConfig,
  updateUserConfig,
} from '~services/user-config'
import { getVersion } from '~utils'
import PagePanel from '../components/Page'

const BING_STYLE_OPTIONS = [
  { name: 'Precise', value: BingConversationStyle.Precise },
  { name: 'Balanced', value: BingConversationStyle.Balanced },
  { name: 'Creative', value: BingConversationStyle.Creative },
]

const POE_MODEL_OPTIONS = [
  { name: 'Claude-Instant', value: PoeModel.ClaudeInstant },
  { name: 'Claude+', value: PoeModel.ClaudePlus },
  { name: 'Claude-instant-100k', value: PoeModel.ClaudeInstant100k },
]

function SettingPage() {
  const { t } = useTranslation()
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [dirty, setDirty] = useState(false)
  const premiumState = usePremium()

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          console.log(c.shortcut)
          setShortcuts(c.shortcut ? [c.shortcut] : [])
        }
      }
    })
    getUserConfig().then((config) => setUserConfig(config))
  }, [])

  const openShortcutPage = useCallback(() => {
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update })
      setDirty(true)
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    let apiHost = userConfig?.openaiApiHost
    if (apiHost) {
      apiHost = apiHost.replace(/\/$/, '')
      if (!apiHost.startsWith('http')) {
        apiHost = 'https://' + apiHost
      }
      // request host permission to prevent CORS issues
      try {
        await Browser.permissions.request({ origins: [apiHost + '/'] })
      } catch (e) {
        console.error(e)
      }
    } else {
      apiHost = undefined
    }
    await updateUserConfig({ ...userConfig!, openaiApiHost: apiHost })
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title={`${t('Settings')} (v${getVersion()})`}>
      <div className="flex flex-col gap-8 mt-3 pr-3">
        <div>
          <p className="font-bold mb-1 text-xl">{t('Export/Import All Data')}</p>
          <p className="mb-3 opacity-80">{t('Data includes all your settings, chat histories, and local prompts')}</p>
          <div className="flex flex-row gap-3">
            <Button size="small" text={t('Export')} icon={<BiExport />} onClick={exportData} />
            <Button size="small" text={t('Import')} icon={<BiImport />} onClick={importData} />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="font-bold mb-2 text-xl">{t('Shortcut to open this app')}</p>
            <div className="flex flex-row gap-1">
              {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : 'Not set'}
            </div>
          </div>
          <div>
            <Button text={t('Change shortcut')} size="normal" onClick={openShortcutPage} />
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-xl">{t('Startup page')}</p>
          <div className="w-[200px]">
            <Select
              options={[
                { name: 'All-In-One', value: ALL_IN_ONE_PAGE_ID },
                ...Object.entries(CHATBOTS).map(([botId, bot]) => ({ name: bot.name, value: botId })),
              ]}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: v })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl">
            {t('All-In-One Mode')}
            {!premiumState.activated && (
              <Link to="/premium" className="text-sm font-normal ml-2 underline italic">
                ({t('Premium Feature')})
              </Link>
            )}
          </p>
          <div className="w-[200px]">
            <Select
              options={[
                { name: t('Two in one'), value: MultiPanelLayout.Two },
                { name: t('Three in one'), value: MultiPanelLayout.Three },
                { name: t('Four in one'), value: MultiPanelLayout.Four },
              ]}
              value={userConfig.multiPanelLayout}
              onChange={(v) => updateConfigValue({ multiPanelLayout: v })}
              disabled={!premiumState.activated}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">ChatGPT</p>
          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 mb-1">
            {(Object.keys(ChatGPTMode) as (keyof typeof ChatGPTMode)[]).map((k) => (
              <div className="flex items-center" key={k}>
                <input
                  id={k}
                  type="radio"
                  checked={userConfig.chatgptMode === ChatGPTMode[k]}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  value={ChatGPTMode[k]}
                  onChange={(e) => updateConfigValue({ chatgptMode: e.currentTarget.value as ChatGPTMode })}
                />
                <label htmlFor={k} className="ml-3 block text-sm font-medium leading-6">
                  {k} Mode
                </label>
              </div>
            ))}
          </div>
          {userConfig.chatgptMode === ChatGPTMode.API ? (
            <ChatGPTAPISettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
          ) : (
            <div className="flex flex-col gap-1 w-[250px]">
              <p className="font-medium text-sm">{t('Model')}</p>
              <Select
                options={[
                  { name: 'Default', value: 'default' },
                  { name: 'GPT-4 (requires Plus)', value: 'gpt-4' },
                ]}
                value={userConfig.chatgptWebappModelName}
                onChange={(v) => updateConfigValue({ chatgptWebappModelName: v })}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl">Bing</p>
          <div className="flex flex-row gap-3 items-center justify-between w-[250px]">
            <p className="font-medium text-base">{t('Chat style')}</p>
            <div className="w-[150px]">
              <Select
                options={BING_STYLE_OPTIONS}
                value={userConfig.bingConversationStyle}
                onChange={(v) => updateConfigValue({ bingConversationStyle: v })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl">Claude</p>
          <div className="flex flex-row gap-3 items-center justify-between w-[250px]">
            <p className="font-medium text-base">{t('Model')}</p>
            <div className="w-[200px]">
              <Select
                options={POE_MODEL_OPTIONS}
                value={userConfig.poeModel}
                onChange={(v) => updateConfigValue({ poeModel: v })}
              />
            </div>
          </div>
        </div>
      </div>
      <Button color={dirty ? 'primary' : 'flat'} text={t('Save')} className="w-fit mt-10 mb-5" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
