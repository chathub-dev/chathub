import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import { Input } from '~app/components/Input'
import Select from '~app/components/Select'
import { getTokenUsage } from '~services/storage'
import {
  BingConversationStyle,
  ChatGPTMode,
  getUserConfig,
  StartupPage,
  updateUserConfig,
  UserConfig,
} from '~services/user-config'
import { formatAmount, formatDecimal } from '~utils/format'
import PagePanel from '../components/Page'

function KDB(props: { text: string }) {
  return (
    <kbd className="px-2 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {props.text}
    </kbd>
  )
}

function SettingPage() {
  const { t } = useTranslation()
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [tokenUsed, setTokenUsed] = useState(0)
  const [dirty, setDirty] = useState(false)

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
    getTokenUsage().then((used) => setTokenUsed(used))
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
    <PagePanel title={t('Settings')}>
      <div className="flex flex-col gap-8 mt-3 pr-3">
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
                { name: 'All-In-One', value: StartupPage.All },
                { name: 'ChatGPT', value: StartupPage.ChatGPT },
                { name: 'Bing', value: StartupPage.Bing },
              ]}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: v })}
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
                <label htmlFor={k} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {k} Mode
                </label>
              </div>
            ))}
          </div>
          {userConfig.chatgptMode === ChatGPTMode.API ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">API Key</p>
                <Input
                  className="w-[300px]"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={userConfig.openaiApiKey}
                  onChange={(e) => updateConfigValue({ openaiApiKey: e.currentTarget.value })}
                  type="password"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">API Host</p>
                <Input
                  className="w-[300px]"
                  placeholder="https://api.openai.com"
                  value={userConfig.openaiApiHost}
                  onChange={(e) => updateConfigValue({ openaiApiHost: e.currentTarget.value })}
                />
              </div>
              {tokenUsed > 0 && (
                <p className="text-sm">
                  Usage: {formatDecimal(tokenUsed)} tokens (~{formatAmount((tokenUsed / 1000) * 0.002)})
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-[200px]">
              <p className="font-medium text-sm">Model</p>
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
          <div className="flex flex-row gap-3 items-center">
            <p className="font-medium text-base">{t('Conversation style')}</p>
            <div className="w-[150px]">
              <Select
                options={[
                  {
                    name: 'Creative',
                    value: BingConversationStyle.Creative,
                  },
                  {
                    name: 'Balanced',
                    value: BingConversationStyle.Balanced,
                  },
                  {
                    name: 'Precise',
                    value: BingConversationStyle.Precise,
                  },
                ]}
                value={userConfig.bingConversationStyle}
                onChange={(v) => updateConfigValue({ bingConversationStyle: v })}
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
