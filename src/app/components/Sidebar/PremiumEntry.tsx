import { FC } from 'react'
import premiumIcon from '~assets/icons/premium.svg'
import { Link } from '@tanstack/react-router'

const PremiumEntry: FC<{ text: string }> = ({ text }) => {
  return (
    <Link to="/premium">
      <div
        className="flex flex-row items-center gap-[10px] rounded-[10px] px-4 py-2 cursor-pointer"
        style={{
          background:
            'linear-gradient(275deg, rgb(var(--color-primary-purple)) 1.65%, rgb(var(--color-primary-blue)) 100%)',
        }}
      >
        <img src={premiumIcon} className="w-8 h-8" />
        {!!text && <span className="text-white font-semibold text-base">{text}</span>}
      </div>
    </Link>
  )
}

export default PremiumEntry
