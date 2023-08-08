import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import useImmutableSWR from 'swr/immutable'
import { fetchPremiumProduct } from '~services/server-api'

const PriceSection: FC = () => {
  const { t } = useTranslation()

  const priceQuery = useImmutableSWR('premium-price', async () => {
    const product = await fetchPremiumProduct()
    return product.price / 100
  })

  return (
    <div className="flex flex-row gap-3">
      <span className="text-[64px] leading-none font-bold text-primary-blue">
        {priceQuery.data ? `$${priceQuery.data}` : '$$$'}
      </span>
      <div className="flex flex-col text-secondary-text font-medium justify-center gap-1">
        <span className="text-2xl leading-none line-through">$49</span>
        <span className="text-sm">/ {t('Lifetime license')}</span>
      </div>
    </div>
  )
}

export default PriceSection
