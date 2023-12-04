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
          <p className="font-semibold text-primary-text">{t('Enjoy ChatHub? Give us a 5-star rating!')}</p>
          <a
            href="https://chromewebstore.google.com/detail/chatgpt-vietnamese/ffookcbdeiclefjibookoikpemgcdanh?pli=1"
            target="_blank"
            rel="noreferrer"
          >
            <Button text={t('Write review')} />
          </a>
        </div>
      </Dialog>
    )
  }

  return null
}

export default GuideModal
