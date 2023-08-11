import { FC, useMemo } from 'react'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'
import { BsQuestionCircle } from 'react-icons/bs'
import checkIcon from '~assets/icons/check.svg'

const FeatureItem: FC<{ title: string; desc?: string; link?: string; textSize: 'small' | 'normal' }> = (props) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <img src={checkIcon} className="w-6 h-6" />
      <div className={cx('flex flex-col', props.textSize === 'small' ? 'text-sm' : 'text-base')}>
        <div className="flex flex-row items-center gap-2">
          <span className="text-primary-text font-medium">{props.title}</span>
          {!!props.link && (
            <a href={props.link} target="_blank" rel="noreferrer">
              <BsQuestionCircle className="cursor-pointer" size="14" />
            </a>
          )}
        </div>
        {!!props.desc && <span className="text-secondary-text">{props.desc}</span>}
      </div>
    </div>
  )
}

const FeatureList: FC<{ textSize: 'small' | 'normal' }> = (props) => {
  const { t } = useTranslation()

  const features = useMemo(() => {
    return [
      {
        title: t('More layouts in All-In-One mode'),
        desc: t('4-in-1, 3-in-1'),
      },
      {
        title: t('Web Access'),
        desc: t('Improving accuracy by searching up-to-date information from the internet'),
        link: 'https://github.com/chathub-dev/chathub/wiki/Web-Access',
      },
      {
        title: t('Full-text search for chat history'),
      },
      {
        title: t('Customize theme'),
      },
      {
        title: t('Quick access in Chrome side bar'),
        link: 'https://github.com/chathub-dev/chathub/wiki/Access-from-Chrome-side-panel',
      },
      {
        title: t('Compare with image input'),
      },
      {
        title: t('Activate up to 5 devices'),
      },
      {
        title: t('Support the development of ChatHub'),
      },
    ]
  }, [t])

  return (
    <div className="flex flex-col gap-4">
      {features.map((feature) => (
        <FeatureItem key={feature.title} {...feature} textSize={props.textSize} />
      ))}
    </div>
  )
}

export default FeatureList
