import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import PagePanel from '../components/Page'
import { getUserConfig, updateUserConfig } from '~services/user-config'

function KDB(props: { text: string }) {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {props.text}
    </kbd>
  )
}

function SettingPage() {
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          setShortcuts(c.shortcut.split(''))
        }
      }
    })
    getUserConfig().then(({ openaiApiKey }) => setApiKey(openaiApiKey))
  }, [])

  const openShortcutPage = useCallback(() => {
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  const saveApiKey = useCallback(async () => {
    await updateUserConfig({ openaiApiKey: apiKey })
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [apiKey])

  return (
    <PagePanel title="Settings">
      <div className="flex flex-col gap-10">
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
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="font-semibold mb-2">OpenAI API key (Optional)</p>
            <div className="flex flex-row gap-1">
              <input
                className="bg-[#F2F2F2] rounded-[20px] px-3 py-1 outline-none text-[#303030] text-sm w-[300px]"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <Button color="flat" size="small" text="save" className="w-fit" onClick={saveApiKey} />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
