import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import PagePanel from '../components/Page'
import { BingConversationStyle, getUserConfig, StartupPage, updateUserConfig, UserConfig } from '~services/user-config'

function KDB(props: { text: string }) {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {props.text}
    </kbd>
  )
}

function SettingPage() {
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          setShortcuts(c.shortcut.split(''))
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
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    await updateUserConfig(userConfig!)
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title="Settings">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="font-semibold mb-2">Shortcut to open this app</p>
            <div className="flex flex-row gap-1">
              {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : 'Not set'}
            </div>
          </div>
          <div>
            <Button text="Change shortcut" size="normal" onClick={openShortcutPage} />
          </div>
        </div>
        <div>
          <p className="font-semibold mb-2">OpenAI API key (Optional)</p>
          <input
            className="bg-[#F2F2F2] rounded-[20px] px-3 py-1 outline-none text-[#303030] text-sm w-[300px]"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={userConfig.openaiApiKey}
            onChange={(e) => updateConfigValue({ openaiApiKey: e.target.value })}
            type="password"
          />
        </div>
        <div>
          <p className="font-semibold mb-2">Bing conversation style</p>
          <select
            className="outline-none"
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
        <div>
          <p className="font-semibold mb-2">Startup page</p>
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
      <Button color="flat" text="Save" className="w-fit mt-10" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
