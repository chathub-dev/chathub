import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import SidePanelPage from './pages/SidePanelPage'
import './base.scss'
import './sidepanel.css'
import { CHATBOTS_UPDATED_EVENT } from './consts'
import { revalidateEnabledBots } from './hooks/use-enabled-bots'

function SidePanelApp() {
  useEffect(() => {
    const handleChatbotsUpdated = () => {
      // 強制再マウントの代わりにSWRキャッシュを再検証
      revalidateEnabledBots()
    }

    window.addEventListener(CHATBOTS_UPDATED_EVENT, handleChatbotsUpdated)

    return () => {
      window.removeEventListener(CHATBOTS_UPDATED_EVENT, handleChatbotsUpdated)
    }
  }, [])

  return <SidePanelPage />
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<SidePanelApp />)
