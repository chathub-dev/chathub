import { useCallback, useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import PagePanel from '../components/Page'

function KDB(props: { text: string }) {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {props.text}
    </kbd>
  )
}

function SettingPage() {
  const [shortcuts, setShortcuts] = useState<string[]>([])

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          setShortcuts(c.shortcut.split(''))
        }
      }
    })
  }, [])

  const openShortcutPage = useCallback(() => {
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  return (
    <PagePanel title="Setting">
      <div className="flex flex-row justify-between">
        <div>
          <p className="font-semibold">Shortcut to open this app</p>
          <div className="flex flex-row gap-1 mt-2">
            {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : 'Not set'}
          </div>
        </div>
        <div>
          <Button text="Change shortcut" size="normal" onClick={openShortcutPage} />
        </div>
      </div>
    </PagePanel>
  )
}

export default SettingPage
