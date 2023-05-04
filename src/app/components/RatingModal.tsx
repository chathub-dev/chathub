import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import Button from './Button'
import Dialog from './Dialog'

async function checkShouldShowRating() {
  const { openTimes = 0 } = await Browser.storage.sync.get('openTimes')
  Browser.storage.sync.set({ openTimes: openTimes + 1 })
  return openTimes === 5
}

const RatingModal: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    checkShouldShowRating().then((shouldShow) => setOpen(shouldShow))
  }, [])

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

export default RatingModal
