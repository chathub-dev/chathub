import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { FC } from 'react'
import premiumIcon from '~assets/icons/premium.svg'

const PremiumEntry: FC<{ text: string }> = ({ text }) => {
  return (
    <Link to="/premium">
      <motion.div
        className="flex flex-row items-center gap-[10px] rounded-[10px] px-4 py-[6px] cursor-pointer"
        style={{
          background:
            'linear-gradient(to left, rgb(var(--color-primary-purple)) 1.65%, rgb(var(--color-primary-blue)) 100%)',
        }}
        whileHover="hover"
      >
        <motion.img
          src={premiumIcon}
          className="w-8 h-8"
          variants={{
            hover: { rotate: [0, 10, -10, 10, -10, 0] },
          }}
          transition={{ duration: 1 }}
        />
        {!!text && <span className="text-white font-semibold text-base">{text}</span>}
      </motion.div>
    </Link>
  )
}

export default PremiumEntry
