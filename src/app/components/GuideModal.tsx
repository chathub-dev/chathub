import { Link } from '@tanstack/react-router'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePremium } from '~app/hooks/use-premium'
import { incrAppOpenTimes } from '~services/storage/open-times'
import Button from './Button'
import Dialog from './Dialog'

const GuideModal: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openTimes, setOpenTimes] = useState(0)
  const premiumState = usePremium()

  useEffect(() => {
    incrAppOpenTimes().then((t) => {
      if (t === 15 || (t > 0 && t % 50 === 0)) {
        setOpen(true)
      }
      setOpenTimes(t)
    })
  }, [])

  if (openTimes === 15) {
    return (
      <Dialog title="🌟🌟🌟🌟🌟" open={open} onClose={() => setOpen(false)} className="rounded-2xl w-[600px]">
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="font-semibold text-primary-text">{t('Enjoy ChatHub? Give us a 5-star rating!')}</p>
          <a
            href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma"
            target="_blank"
            rel="noreferrer"
          >
            <Button text={t('Write review')} />
          </a>
        </div>
      </Dialog>
    )
  }

  if (openTimes > 0 && openTimes % 50 === 0 && !premiumState.isLoading && !premiumState.activated) {
    return (
      <Dialog title="🥳 🥳 🥳" open={open} onClose={() => setOpen(false)} className="rounded-2xl w-[600px]">
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="font-semibold text-primary-text w-[300px] text-center">
            {t('You have opened ChatHub {{openTimes}} times, consider unlock all features?', { openTimes })}
          </p>
          <Link
            to="/premium"
            search={{ source: 'open-times' }}
            onClick={() => setOpen(false)}
            className="focus-visible:outline-none"
          >
            <Button color="primary" text={t('Checkout premium features')} />
          </Link>
        </div>
      </Dialog>
    )
  }

  return null
}

export default GuideModal
