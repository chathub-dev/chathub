import { useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import premiumIcon from '~/assets/icons/premium.svg'
import Button from './components/Button'
import { usePremium } from './hooks/use-premium'
import './i18n'
import SidePanelPage from './pages/SidePanelPage'
import { trackEvent } from './plausible'
import './base.scss'
import './sidepanel.css'

function PremiumOnly() {
  const { t } = useTranslation()

  const openPremiumPage = useCallback(() => {
    trackEvent('open_premium_from_sidepanel')
    window.open(Browser.runtime.getURL('app.html#/premium?source=sidepanel'), '_blank')
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3">
      <img src={premiumIcon} className="w-10 h-10" />
      <div className="text-xl font-bold">{t('Premium Feature')}</div>
      <Button text={t('Upgrade to unlock')} color="primary" onClick={openPremiumPage} />
    </div>
  )
}

function SidePanelApp() {
  const premiumState = usePremium()
  if (premiumState.isLoading) {
    return null
  }
  if (premiumState.activated) {
    return <SidePanelPage />
  }
  return <PremiumOnly />
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<SidePanelApp />)
