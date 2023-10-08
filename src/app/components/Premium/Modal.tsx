import { useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDiscountCode } from '~app/hooks/use-purchase-info'
import { trackEvent } from '~app/plausible'
import { showPremiumModalAtom } from '~app/state'
import { incrPremiumModalOpenTimes } from '~services/storage/open-times'
import Button from '../Button'
import Dialog from '../Dialog'
import DiscountBadge from './DiscountBadge'
import FeatureList from './FeatureList'
import PriceSection from './PriceSection'
import Testimonials from './Testimonials'

const PremiumModal: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useAtom(showPremiumModalAtom)
  const discountCode = useDiscountCode()

  const feature = typeof open === 'string' ? open : undefined

  useEffect(() => {
    if (open) {
      incrPremiumModalOpenTimes().then((openTimes) => {
        trackEvent('show_premium_modal', { source: feature, openTimes })
      })
    }
  }, [feature, open])

  const onClickBuy = useCallback(() => {
    trackEvent('click_buy_premium', { source: 'premium_modal' })
    navigate({ to: '/premium', search: { source: 'after_click_buy_premium' } })
  }, [navigate])

  const close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog title={t('Premium Feature')} open={!!open} onClose={close} className="min-w-[600px]">
      <div className="flex flex-col items-center my-7 gap-7 overflow-y-auto">
        <div className="flex flex-col items-center gap-3">
          <PriceSection align="center" />
          <DiscountBadge />
        </div>
        <div className="w-full px-20">
          <FeatureList highlightFeature={feature} />
        </div>
        <a
          href={`https://chathub.gg/api/premium/redirect?source=${feature || ''}&discountCode=${discountCode || ''}`}
          target="_blank"
          rel="noreferrer"
          onClick={onClickBuy}
        >
          <Button text={t('Buy premium license')} color="primary" className="!py-[11px] px-16 rounded-lg" />
        </a>
        <Testimonials />
      </div>
    </Dialog>
  )
}

export default PremiumModal
