import { useAtom } from 'jotai'
import { ofetch } from 'ofetch'
import { FC, useCallback, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BsQuestionCircle } from 'react-icons/bs'
import useImmutableSWR from 'swr/immutable'
import Button from '~app/components/Button'
import { usePremium } from '~app/hooks/use-premium'
import { trackEvent } from '~app/plausible'
import { licenseKeyAtom } from '~app/state'
import checkIcon from '~assets/icons/check.svg'
import { deactivateLicenseKey } from '~services/premium'

const FeatureItem: FC<{ text: string; link?: string }> = ({ text, link }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={checkIcon} className="w-6 h-6" />
      <span className="text-primary-text font-medium">{text}</span>
      {!!link && (
        <a href={link} target="_blank" rel="noreferrer">
          <BsQuestionCircle className="cursor-pointer" />
        </a>
      )}
    </div>
  )
}

function PremiumPage() {
  const { t } = useTranslation()
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom)
  const premiumState = usePremium()
  const [deactivating, setDeactivating] = useState(false)

  const priceQuery = useImmutableSWR('premium-price', async () => {
    const product = await ofetch('https://chathub.gg/api/premium/product')
    return product.price / 100
  })

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
    <div className="flex flex-col bg-primary-background dark:text-primary-text rounded-[20px] h-full p-[50px] overflow-y-auto">
      <h1 className="font-bold text-[40px] leading-none text-primary-text">{t('Premium')}</h1>
      {!premiumState.activated && (
        <p className="bg-[#FAE387] text-[#303030] w-fit rounded-[5px] px-2 py-[4px] text-sm font-semibold mt-9">
          {t('Earlybird price')}
        </p>
      )}
      {!premiumState.activated && (
        <div className="flex flex-row items-end mt-5 gap-3">
          <span className="text-[64px] leading-none font-bold text-primary-blue">
            {priceQuery.data ? `$${priceQuery.data}` : '$$$'}
          </span>
          <span className="text-[50px] leading-none font-semibold text-secondary-text line-through">$39</span>
          <span className="text-secondary-text font-semibold pb-1">/ {t('Lifetime license')}</span>
        </div>
      )}
      <div className="mt-10 flex flex-col gap-4">
        <FeatureItem text={t('More bots in All-In-One mode')} />
        <FeatureItem text={t('Web Access')} link="https://github.com/chathub-dev/chathub/wiki/Web-Access" />
        <FeatureItem text={t('Chat history full-text search')} />
        <FeatureItem text={t('Customize theme')} />
        <FeatureItem
          text={t('Quick access in Chrome side bar')}
          link="https://github.com/chathub-dev/chathub/wiki/Access-from-Chrome-side-panel"
        />
        <FeatureItem text={t('Compare with image input')} />
        <FeatureItem text={t('Activate up to 5 devices')} />
        <FeatureItem text={t('More features in the future')} />
        <FeatureItem text={t('Support the development of ChatHub')} />
      </div>
      <div className="flex flex-row items-center gap-3 mt-8">
        {premiumState.activated ? (
          <>
            <Button text={t('🎉 License activated')} color="primary" className="w-fit !py-2" />
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
              href="https://chathub.gg/api/premium/redirect"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('click_buy_premium')}
            >
              <Button text={t('Get premium license')} color="primary" className="w-fit !py-2 rounded-lg" />
            </a>
            <Button
              text={t('Activate license')}
              color="flat"
              className="w-fit !py-2 rounded-lg"
              onClick={activateLicense}
              isLoading={premiumState.isLoading}
            />
          </>
        )}
        <a
          href="https://app.lemonsqueezy.com/my-orders/"
          target="_blank"
          rel="noreferrer"
          className="underline ml-2 text-sm text-secondary-text font-medium w-fit"
        >
          {t('Manage order and devices')}
        </a>
      </div>
      {!!premiumState.error && <span className="mt-3 text-red-500 font-medium">{premiumState.error}</span>}
      <Toaster position="top-right" />
    </div>
  )
}

export default PremiumPage
