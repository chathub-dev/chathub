import { useAtom, useSetAtom } from 'jotai'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '~/services/server-api'
import { showDiscountModalAtom, showPremiumModalAtom } from '~app/state'
import discountBg from '~assets/discount-bg.png'
import Button from '../Button'
import Dialog from '../Dialog'

interface DiscountDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  subtitle?: string
  onConfirm: () => void
  loading?: boolean
}

const DiscountDialog: FC<DiscountDialogProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Dialog title="" open={props.open} onClose={() => props.setOpen(false)} className="min-w-[600px] shadow-inner">
      <div
        className="flex flex-col items-center gap-1 pb-7"
        style={{ backgroundImage: 'linear-gradient(to bottom, #AEA5DB 0%, #FFFFFF 100%)' }}
      >
        <div className="w-full h-[250px] relative">
          <img src={discountBg} className="absolute w-full h-full top-0 left-0" />
          <div className="flex flex-col items-center justify-center gap-4 h-full relative">
            <span className="text-4xl">🎁</span>
            <p className="font-black text-4xl text-[#303030]">{props.title}</p>
            {!!props.subtitle && <p className="font-bold text-2xl text-[#303030]">{props.subtitle}</p>}
          </div>
        </div>
        <Button
          text={t('Get Discount')}
          color="primary"
          onClick={props.onConfirm}
          isLoading={props.loading}
          className="px-10 py-[10px]"
        />
      </div>
    </Dialog>
  )
}

const DiscountModal: FC = () => {
  const [open, setOpen] = useAtom(showDiscountModalAtom)
  const [creating, setCreating] = useState(false)
  const setShowPremiumModal = useSetAtom(showPremiumModalAtom)
  const { t } = useTranslation()

  const createDiscount = useCallback(async () => {
    setCreating(true)
    await api.createDiscount()
    setCreating(false)
    setOpen(false)
    setShowPremiumModal(true)
  }, [setOpen, setShowPremiumModal])

  const showPremiumModal = useCallback(() => {
    setOpen(false)
    setShowPremiumModal(true)
  }, [setOpen, setShowPremiumModal])

  useEffect(() => {
    if (open) {
    }
  }, [open])

  return (
    <DiscountDialog
      open={!!open}
      setOpen={setOpen}
      title={typeof open !== 'boolean' ? open.description : t('Special Offer: 20% OFF')}
      subtitle={typeof open !== 'boolean' ? undefined : t('TODAY ONLY')}
      onConfirm={typeof open !== 'boolean' ? showPremiumModal : createDiscount}
      loading={creating}
    />
  )
}

export default DiscountModal
