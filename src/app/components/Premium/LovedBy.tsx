import { FC } from 'react'
import { AiFillStar } from 'react-icons/ai'

const LovedBy: FC = () => {
  return (
    <div className="border-primary-border rounded-full border px-4 py-1 flex flex-row items-center gap-2">
      <div className="flex flex-row">
        <AiFillStar color="gold" size={15} />
        <AiFillStar color="gold" size={15} />
        <AiFillStar color="gold" size={15} />
        <AiFillStar color="gold" size={15} />
        <AiFillStar color="gold" size={15} />
      </div>
      <span className="text-sm font-medium text-primary-text">Loved by 100,000+ users</span>
    </div>
  )
}

export default LovedBy
