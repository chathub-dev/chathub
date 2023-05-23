import { Link } from '@tanstack/react-router'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import { usePremium } from '~app/hooks/use-premium'
import Button from './Button'
import Dialog from './Dialog'

async function incrOpenTimes() {
  const { openTimes = 0 } = await Browser.storage.sync.get('openTimes')
  Browser.storage.sync.set({ openTimes: openTimes + 1 })
  return openTimes
}

const GuideModal: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openTimes, setOpenTimes] = useState(0)
  const premiumState = usePremium()

  useEffect(() => {
    incrOpenTimes().then((t) => {
      setOpen(t === 5 || (t > 0 && t % 50 === 0))
      setOpenTimes(t)
    })
  }, [])

  if (openTimes === 5) {
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
          <Link to="/premium" onClick={() => setOpen(false)} className="focus-visible:outline-none">
            <Button color="primary" text={t('Checkout premium features')} />
          </Link>
        </div>
      </Dialog>
    )
  }

  return null
}

export default GuideModal
