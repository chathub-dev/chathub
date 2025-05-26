import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { incrAppOpenTimes } from '~services/storage/open-times'
import Button from './Button'
import Dialog from './Dialog'

const GuideModal: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openTimes, setOpenTimes] = useState(0)

  useEffect(() => {
    incrAppOpenTimes().then((t) => {
      if (t === 15) {
        setOpen(true)
      }
      setOpenTimes(t)
    })
  }, [])

  if (openTimes === 15) {
    return (
      <Dialog title="🌟🌟🌟🌟🌟" open={open} onClose={() => setOpen(false)} className="rounded-2xl w-[600px]">
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="font-semibold text-primary-text">{t('Thank you for using HuddleLLM!')}</p>
          {/* <a
            href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma"
            target="_blank"
            rel="noreferrer"
          >
            <Button text={t('Write review')} />
          </a> */}
        </div>
      </Dialog>
    )
  }

  return null
}

export default GuideModal
