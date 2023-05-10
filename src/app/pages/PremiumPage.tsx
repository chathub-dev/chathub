import { useAtom } from 'jotai'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '~app/components/Button'
import { usePremium } from '~app/hooks/use-premium'
import { trackEvent } from '~app/plausible'
import { licenseKeyAtom } from '~app/state'
import checkIcon from '~assets/icons/check.svg'
import { deactivateLicenseKey } from '~services/premium'

const FeatureItem: FC<{ text: string; comingsoon?: boolean }> = ({ text, comingsoon }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={checkIcon} className="w-6 h-6" />
      <span className="text-primary-text font-medium">{text}</span>
      {comingsoon && <span className="text-xs text-secondary-text">(Coming soon)</span>}
    </div>
  )
}

function PremiumPage() {
  const { t } = useTranslation()
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom)
  const premiumState = usePremium()
  const [deactivating, setDeactivating] = useState(false)

  const activateLicense = useCallback(() => {
    const key = window.prompt('Enter your license key', '')
    if (key) {
      setLicenseKey(key)
    }
  }, [setLicenseKey])

  const deactivateLicense = useCallback(async () => {
    if (!licenseKey) {
      return
    }
    if (!window.confirm('Are you sure to deactivate this device?')) {
      return
    }
    setDeactivating(true)
    await deactivateLicenseKey(licenseKey)
    setLicenseKey('')
    setTimeout(() => location.reload(), 500)
  }, [licenseKey, setLicenseKey])

  return (
    <div className="flex flex-col overflow-hidden bg-primary-background dark:text-primary-text rounded-[20px] h-full p-[50px]">
      <h1 className="font-bold text-[40px] leading-none text-primary-text">{t('Premium')}</h1>
      {!premiumState.activated && (
        <p className="bg-[#FAE387] text-[#303030] w-fit rounded-[5px] px-2 py-[4px] text-sm font-semibold mt-9">
          {t('Presale discount')}
        </p>
      )}
      {!premiumState.activated && (
        <div className="flex flex-row items-end mt-5 gap-3">
          <span className="text-[64px] leading-none font-bold text-primary-blue">$15</span>
          <span className="text-[50px] leading-none font-semibold text-secondary-text line-through">$30</span>
          <span className="text-secondary-text font-semibold pb-1">/ Lifetime license</span>
        </div>
      )}
      <div className="mt-10 flex flex-col gap-4">
        <FeatureItem text={t('More bots in All-In-One mode')} />
        <FeatureItem text={t('Chat history full-text search')} />
        <FeatureItem text={t('Cloud syncing data')} comingsoon />
        <FeatureItem text={t('Customize theme')} comingsoon />
        <FeatureItem text={t('Activate up to 5 devices')} />
        <FeatureItem text={t('More in the future')} />
      </div>
      {premiumState.activated ? (
        <div className="flex flex-row items-center gap-3 mt-8">
          <Button text={t('🎉 License activated')} color="primary" className="w-fit" />
          <Button text={t('Deactivate')} className="w-fit" onClick={deactivateLicense} isLoading={deactivating} />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-3 mt-8">
          <a
            href="https://chathub.lemonsqueezy.com/checkout/buy/7f84853c-e84a-400e-94f4-ff0ca02fffb8"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('click_buy_premium')}
          >
            <Button text={t('Get premium license')} color="primary" className="w-fit py-3 rounded-lg" />
          </a>
          <Button
            text={t('Activate license')}
            color="flat"
            className="w-fit py-3 rounded-lg"
            onClick={activateLicense}
            isLoading={premiumState.isLoading}
          />
        </div>
      )}
    </div>
  )
}

export default PremiumPage
