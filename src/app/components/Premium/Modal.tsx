import { useNavigate } from '@tanstack/react-router'
import { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '~app/plausible'
import Button from '../Button'
import Dialog from '../Dialog'
import FeatureList, { FeatureId } from './FeatureList'
import PriceSection from './PriceSection'
import Testimonials from './Testimonials'
import DiscountBadge from './DiscountBadge'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  feature?: FeatureId
}

const PremiumModal: FC<Props> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (props.open) {
      trackEvent('show_premium_modal', { source: props.feature })
    }
  }, [props.open, props.feature])

  const onClickBuy = useCallback(() => {
    trackEvent('click_buy_premium', { source: 'premium_modal' })
    navigate({ to: '/premium', search: { source: 'after_click_buy_premium' } })
  }, [navigate])

  return (
    <Dialog
      title={t('Premium Feature')}
      open={props.open}
      onClose={() => props.setOpen(false)}
      className="min-w-[600px]"
    >
      <div className="flex flex-col items-center my-7 gap-7 overflow-y-auto">
        <div className="flex flex-col items-center gap-3">
          <PriceSection />
          <DiscountBadge />
        </div>
        <div className="w-full px-20">
          <FeatureList highlightFeature={props.feature} />
        </div>
        <a
          href={`https://chathub.gg/api/premium/redirect?source=${props.feature || ''}`}
          target="_blank"
          rel="noreferrer"
          onClick={onClickBuy}
        >
          <Button text={t('Get premium license')} color="primary" className="!py-[11px] px-16 rounded-lg" />
        </a>
        <Testimonials />
      </div>
    </Dialog>
  )
}

export default PremiumModal
