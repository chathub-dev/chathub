import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import { getTokenUsage } from '~services/storage'
import { BingConversationStyle, getUserConfig, StartupPage, updateUserConfig, UserConfig } from '~services/user-config'
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
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [tokenUsed, setTokenUsed] = useState(0)

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
    <PagePanel title="Settings">
      <div className="flex flex-col gap-8 mt-3 pr-3">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="font-bold mb-2 text-xl">Shortcut to open this app</p>
            <div className="flex flex-row gap-1">
              {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : 'Not set'}
            </div>
          </div>
          <div>
            <Button text="Change shortcut" size="normal" onClick={openShortcutPage} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">ChatGPT API</p>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-base">API Key</p>
            <input
              className="bg-[#F2F2F2] rounded-[20px] px-3 py-2 outline-none text-[#303030] text-sm w-[300px]"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={userConfig.openaiApiKey}
              onChange={(e) => updateConfigValue({ openaiApiKey: e.target.value })}
              type="password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-base">API Host</p>
            <input
              className="bg-[#F2F2F2] rounded-[20px] px-3 py-2 outline-none text-[#303030] text-sm w-[300px]"
              placeholder="https://api.openai.com"
              value={userConfig.openaiApiHost}
              onChange={(e) => updateConfigValue({ openaiApiHost: e.target.value })}
            />
          </div>
          {tokenUsed > 0 && (
            <p className="text-sm">
              Usage: {formatDecimal(tokenUsed)} tokens (~{formatAmount((tokenUsed / 1000) * 0.002)})
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl">Bing</p>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-base">Conversation Style</p>
            <select
              className="outline-none w-fit"
              value={userConfig.bingConversationStyle}
              onChange={(e) =>
                updateConfigValue({ bingConversationStyle: e.target.value } as {
                  bingConversationStyle: BingConversationStyle
                })
              }
            >
              <option value={BingConversationStyle.Creative}>Creative</option>
              <option value={BingConversationStyle.Balanced}>Balanced</option>
              <option value={BingConversationStyle.Precise}>Precise</option>
            </select>
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-xl">Startup page</p>
          <select
            className="outline-none"
            value={userConfig.startupPage}
            onChange={(e) => updateConfigValue({ startupPage: e.target.value } as { startupPage: StartupPage })}
          >
            <option value={StartupPage.All}>All-In-One</option>
            <option value={StartupPage.ChatGPT}>ChatGPT</option>
            <option value={StartupPage.Bing}>Bing</option>
          </select>
        </div>
      </div>
      <Button color="flat" text="Save" className="w-fit mt-10 mb-5" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
