import { useSearch } from '@tanstack/react-router'
import { get as getPath } from 'lodash-es'
import { useCallback, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Button from '~app/components/Button'
import DiscountBadge from '~app/components/Premium/DiscountBadge'
import FeatureList from '~app/components/Premium/FeatureList'
import PriceSection from '~app/components/Premium/PriceSection'
import { usePremium } from '~app/hooks/use-premium'
import { useDiscountCode } from '~app/hooks/use-purchase-info'
import { trackEvent } from '~app/plausible'
import { premiumRoute } from '~app/router'
import { activatePremium, deactivatePremium } from '~services/premium'

function PremiumPage() {
  const { t } = useTranslation()
  const premiumState = usePremium()
  const [activating, setActivating] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [activationError, setActivationError] = useState('')
  const { source } = useSearch({ from: premiumRoute.id })
  const [isExploding, setIsExploding] = useState(false)
  const discountCode = useDiscountCode()

  const activate = useCallback(async () => {
    const key = window.prompt('Enter your license key', '')
    if (!key) {
      return
    }
    setActivationError('')
    setActivating(true)
    trackEvent('activate_license')
    try {
      await activatePremium(key)
    } catch (err) {
      console.error('activation', err)
      setActivationError(getPath(err, 'data.error') || 'Activation failed')
      setActivating(false)
      return
    }
    setTimeout(() => location.reload(), 500)
  }, [])

  const deactivateLicense = useCallback(async () => {
    if (!window.confirm('Are you sure to deactivate this device?')) {
      return
    }
    setDeactivating(true)
    trackEvent('deactivate_license')
    await deactivatePremium()
    setTimeout(() => location.reload(), 500)
  }, [])

  return (
    <div className="flex flex-col bg-primary-background dark:text-primary-text rounded-[20px] h-full p-[50px] overflow-y-auto">
      <h1 className="font-bold text-[40px] leading-none text-primary-text">{t('Premium')}</h1>
      {!premiumState.activated && (
        <div className="flex flex-col gap-4 mt-9">
          <DiscountBadge />
          <PriceSection align="left" />
        </div>
      )}
      <div className="mt-8">
        <FeatureList />
      </div>
      <div className="flex flex-row items-center gap-3 mt-10">
        {premiumState.activated ? (
          <>
            <Button
              text={t('🎉 License activated')}
              color="primary"
              className="w-fit !py-2"
              onClick={() => setIsExploding(true)}
            />
            <Button
              text={t('Deactivate')}
              className="w-fit !py-2"
              onClick={deactivateLicense}
              isLoading={deactivating}
            />
          </>
        ) : (
          <>
            <a
              href={`https://chathub.gg/api/premium/redirect?source=${source || ''}&discountCode=${discountCode || ''}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('click_buy_premium', { source: 'premium_page' })}
            >
              <Button text={t('Buy premium license')} color="primary" className="w-fit !py-2 rounded-lg" />
            </a>
            <Button
              text={t('Activate license')}
              color="flat"
              className="w-fit !py-2 rounded-lg"
              onClick={activate}
              isLoading={activating || premiumState.isLoading}
            />
          </>
        )}
      </div>
      {!!(premiumState.error || activationError) && (
        <span className="mt-3 text-red-500 font-medium">{premiumState.error || activationError}</span>
      )}
      <Toaster position="top-right" />
      {isExploding && <ConfettiExplosion duration={3000} onComplete={() => setIsExploding(false)} />}
    </div>
  )
}

export default PremiumPage
