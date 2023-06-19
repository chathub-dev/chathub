import { Link } from '@tanstack/react-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import Dialog from './Dialog'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

const PremiumFeatureModal: FC<Props> = (props) => {
  const { t } = useTranslation()
  return (
    <Dialog
      title={`🔒 ${t('Premium Feature')}`}
      open={props.open}
      onClose={() => props.setOpen(false)}
      className="rounded-2xl w-[500px]"
    >
      <div className="flex flex-col items-center gap-4 py-5">
        <p className="font-semibold text-primary-text text-center w-[70%]">
          {t('Upgrade to premium to chat with more than two bots at once')}
        </p>
        <Link to="/premium" onClick={() => props.setOpen(false)} className="focus-visible:outline-none">
          <Button color="primary" text={t('Upgrade')} />
        </Link>
      </div>
    </Dialog>
  )
}

export default PremiumFeatureModal
