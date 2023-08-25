import { useAtom, useSetAtom } from 'jotai'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '~/services/server-api'
import { trackEvent } from '~app/plausible'
import { showDiscountModalAtom, showPremiumModalAtom } from '~app/state'
import discountBg from '~assets/discount-bg.png'
import Button from '../Button'
import Dialog from '../Dialog'

const DiscountModal: FC = () => {
  const [open, setOpen] = useAtom(showDiscountModalAtom)
  const [creating, setCreating] = useState(false)
  const setShowPremiumModal = useSetAtom(showPremiumModalAtom)
  const { t } = useTranslation()

  const createDiscount = useCallback(async () => {
    trackEvent('create_discount')
    setCreating(true)
    await api.createDiscount()
    setCreating(false)
    setOpen(false)
    setShowPremiumModal(true)
  }, [setOpen, setShowPremiumModal])

  useEffect(() => {
    if (open) {
      trackEvent('show_discount_modal')
    }
  }, [open])

  return (
    <Dialog title="" open={open} onClose={() => setOpen(false)} className="min-w-[600px] shadow-inner">
      <div
        className="flex flex-col items-center gap-1 pb-7"
        style={{ backgroundImage: 'linear-gradient(to bottom, #AEA5DB 0%, #FFFFFF 100%)' }}
      >
        <div className="w-full h-[250px] relative">
          <img src={discountBg} className="absolute w-full h-full top-0 left-0" />
          <div className="flex flex-col items-center justify-center gap-4 h-full relative">
            <span className="text-4xl">🎁</span>
            <p className="font-black text-4xl text-[#303030]">{t('Special Offer: 20% OFF')}</p>
            <p className="font-bold text-2xl text-[#303030]">{t('TODAY ONLY')}</p>
          </div>
        </div>
        <Button
          text={t('Get Discount')}
          color="primary"
          onClick={createDiscount}
          isLoading={creating}
          className="px-10 py-[10px]"
        />
      </div>
    </Dialog>
  )
}

export default DiscountModal
