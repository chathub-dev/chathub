import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const DiscountBadge: FC = () => {
  const { t } = useTranslation()
  return (
    <p className="bg-[#FAE387] text-[#303030] w-fit rounded-[5px] px-2 py-[4px] text-sm font-semibold">
      {t('Limited-time offer')}
    </p>
  )
}

export default DiscountBadge
