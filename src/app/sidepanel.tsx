import { useCallback, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import Button from './components/Button'
import './i18n'
import SidePanelPage from './pages/SidePanelPage'
import './base.scss'
import './sidepanel.css'
import { CHATBOTS_UPDATED_EVENT } from './consts'



function SidePanelApp() {
  const [chatbotsUpdated, setChatbotsUpdated] = useState(false)

  useEffect(() => {
    const handleChatbotsUpdated = () => {
      setChatbotsUpdated(prev => !prev)
    }

    window.addEventListener(CHATBOTS_UPDATED_EVENT, handleChatbotsUpdated)

    return () => {
      window.removeEventListener(CHATBOTS_UPDATED_EVENT, handleChatbotsUpdated)
    }
  }, [])

  return <SidePanelPage key={chatbotsUpdated ? 'updated' : 'initial'} />
  
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<SidePanelApp />)
