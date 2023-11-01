import dayjs, { Dayjs } from 'dayjs'
import humanizeDuration from 'humanize-duration'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePurchaseInfo } from '~app/hooks/use-purchase-info'
import { Campaign } from '~services/server-api'
import { cx } from '~utils'

const DiscountCountDown: FC<{ originalPrice: number; endsAt: Dayjs }> = (props) => {
  const [now, setNow] = useState(() => dayjs())
  const { t } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (props.endsAt.isBefore(now)) {
    return null
  }

  return (
    <div className="bg-[#FF6B6B] text-white px-4 py-1 rounded-xl font-medium text-sm mt-2 flex flex-row items-center gap-1">
      <del className="font-bold">${props.originalPrice / 100}</del>
      <span>
        {t('20% OFF: ends in')} {humanizeDuration(props.endsAt.diff(now), { units: ['d', 'h', 'm', 's'], round: true })}
      </span>
    </div>
  )
}

const CampaignBanner: FC<{ campaign: Campaign }> = (props) => {
  return (
    <div className="bg-[#FF6B6B] text-white px-4 py-1 rounded-xl font-medium text-sm mb-3">
      <span>{props.campaign.description}</span>
    </div>
  )
}

const PriceSection: FC<{ align: 'center' | 'left' }> = (props) => {
  const { t } = useTranslation()
  const purchaseInfoQuery = usePurchaseInfo()

  const calculatedPrice = useMemo(() => {
    if (!purchaseInfoQuery.data) {
      return null
    }
    const { price, discount, campaign } = purchaseInfoQuery.data
    if (discount) {
      return discount.price / 100
    }
    if (campaign) {
      return campaign.price / 100
    }
    return price / 100
  }, [purchaseInfoQuery.data])

  const discountEndsAt = useMemo(() => {
    if (!purchaseInfoQuery.data) {
      return null
    }
    const { discount } = purchaseInfoQuery.data
    if (discount) {
      return dayjs(discount.startTime).add(1, 'day')
    }
  }, [purchaseInfoQuery.data])

  return (
    <div className={cx('flex flex-col', props.align === 'center' ? 'items-center' : 'items-start')}>
      {purchaseInfoQuery.data?.campaign && <CampaignBanner campaign={purchaseInfoQuery.data.campaign} />}
      <div className="flex flex-row gap-3">
        <span className="text-[64px] leading-none font-bold text-primary-blue">
          {calculatedPrice ? `$${calculatedPrice}` : '$$$'}
        </span>
        <div className="flex flex-col text-secondary-text font-medium justify-center gap-1">
          <span className="text-2xl leading-none line-through">$49</span>
          <span className="text-sm">/ {t('Lifetime license')}</span>
        </div>
      </div>
      {discountEndsAt && purchaseInfoQuery.data && (
        <DiscountCountDown originalPrice={purchaseInfoQuery.data.price} endsAt={discountEndsAt} />
      )}
    </div>
  )
}

export default PriceSection
