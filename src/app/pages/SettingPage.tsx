import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiExport, BiImport } from 'react-icons/bi'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import { Input } from '~app/components/Input'
import Select from '~app/components/Select'
import { CHATGPT_API_MODELS } from '~app/consts'
import { exportData, importData } from '~app/utils/export'
import { getTokenUsage } from '~services/storage'
import {
  BingConversationStyle,
  ChatGPTMode,
  DarkMode,
  getUserConfig,
  StartupPage,
  updateUserConfig,
  UserConfig,
} from '~services/user-config'
import { getVersion } from '~utils'
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
            <p className="font-bold mb-2 text-xl text-[var(--text-1)]">{t('Shortcut to open this app')}</p>
            <div className="flex flex-row gap-1 text-[var(--text-1)]">
              {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : 'Not set'}
            </div>
          </div>
          <div>
            <Button text={t('Change shortcut')} size="normal" onClick={openShortcutPage} />
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-xl text-[var(--text-1)]">{t('Startup page')}</p>
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
          <p className="font-bold text-xl text-[var(--text-1)]">ChatGPT</p>
          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 mb-1">
            {(Object.keys(ChatGPTMode) as (keyof typeof ChatGPTMode)[]).map((k) => (
              <div className="flex items-center" key={k}>
                <input
                  id={k}
                  type="radio"
                  checked={userConfig.chatgptMode === ChatGPTMode[k]}
                  className="h-4 w-4 border-gray-300 dark:border-gray-900 dark:bg-gray-800 text-indigo-600 focus:ring-indigo-600"
                  value={ChatGPTMode[k]}
                  onChange={(e) => updateConfigValue({ chatgptMode: e.currentTarget.value as ChatGPTMode })}
                />
                <label
                  htmlFor={k}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
                >
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
              <div className="flex flex-col gap-1 w-[200px]">
                <p className="font-medium text-sm">API Model</p>
                <Select
                  options={CHATGPT_API_MODELS.map((m) => ({ name: m, value: m }))}
                  value={userConfig.chatgptApiModel}
                  onChange={(v) => updateConfigValue({ chatgptApiModel: v })}
                />
              </div>
              {tokenUsed > 0 && (
                <p className="text-sm">
                  Usage: {formatDecimal(tokenUsed)} tokens (~{formatAmount((tokenUsed / 1000) * 0.002)})
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-row gap-3 items-center">
              <p className="font-medium text-base text-[var(--text-1)]">{t('Model')}</p>
              <div className="w-[200px]">
              <Select
                options={[
                  { name: 'Default', value: 'default' },
                  { name: 'GPT-4 (requires Plus)', value: 'gpt-4' },
                ]}
                value={userConfig.chatgptWebappModelName}
                onChange={(v) => updateConfigValue({ chatgptWebappModelName: v })}
              />
            </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl text-[var(--text-1)]">Bing</p>
          <div className="flex flex-row gap-3 items-center">
            <p className="font-medium text-base text-[var(--text-1)]">{t('Conversation style')}</p>
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
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl text-[var(--text-1)]">{t('Dark Mode')}</p>
          <div className="w-[150px]">
            <Select
              options={[
                {
                  name: t('Follow System'),
                  value: DarkMode.Auto,
                },
                {
                  name: t('Dark'),
                  value: DarkMode.Dark,
                },
                {
                  name: t('Light'),
                  value: DarkMode.Light,
                },
              ]}
              value={userConfig.darkMode}
              onChange={(v) => updateConfigValue({ darkMode: v })}
            />
          </div>
        </div>
      </div>
      <Button color={dirty ? 'primary' : 'flat'} text={t('Save')} className="w-fit mt-10 mb-5" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
