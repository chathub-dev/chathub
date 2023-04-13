import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '~app/components/Button'
import checkIcon from '~assets/icons/check.svg'

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
  return (
    <div className="flex flex-col overflow-hidden bg-primary-background dark:text-primary-text rounded-[35px] h-full p-[50px]">
      <h1 className="font-bold text-[40px] leading-none text-primary-text">{t('Premium')}</h1>
      <p className="bg-[#FAE387] text-[#303030] w-fit rounded-[5px] px-2 py-[4px] text-sm font-semibold mt-9">
        {t('Presale discount')}
      </p>
      <div className="flex flex-row items-end mt-5 gap-3">
        <span className="text-[64px] leading-none font-bold text-primary-blue">$15</span>
        <span className="text-[50px] leading-none font-semibold text-secondary-text line-through">$30</span>
        <span className="text-secondary-text font-semibold pb-1">/ Lifetime license</span>
      </div>
      <div className="mt-10 flex flex-col gap-4">
        <FeatureItem text={t('Cloud syncing data')} comingsoon />
        <FeatureItem text={t('More bots in All-In-One mode')} comingsoon />
        <FeatureItem text={t('Chat history full-text search')} comingsoon />
        <FeatureItem text={t('Customize theme')} comingsoon />
        <FeatureItem text={t('More in the future')} />
      </div>
      <a
        href="https://chathub.lemonsqueezy.com/checkout/buy/7f84853c-e84a-400e-94f4-ff0ca02fffb8"
        target="_blank"
        rel="noreferrer"
      >
        <Button text="Get premium license" color="primary" className="w-fit mt-8 py-3 rounded-lg" />
      </a>
    </div>
  )
}

export default PremiumPage
