import { sample } from 'lodash-es'
import { FC } from 'react'
import { AiFillStar } from 'react-icons/ai'

const Testimonials: FC = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="border-primary-border rounded-full border px-4 py-1 flex flex-row items-center gap-2 w-fit">
        <div className="flex flex-row">
          <AiFillStar color="gold" size={15} />
          <AiFillStar color="gold" size={15} />
          <AiFillStar color="gold" size={15} />
          <AiFillStar color="gold" size={15} />
          <AiFillStar color="gold" size={15} />
        </div>
        <span className="text-sm font-medium text-primary-text">Loved by 100,000+ users</span>
      </div>
      <p className="italic text-sm text-center text-secondary-text w-3/4">
        {sample([
          '"What a great idea AND implementation - to have all the major chats on one page" - Chad Tunis',
          '"Very helpful, works great and is exactly what i was looking for, I bought premium" - Artush Foto',
        ])}
      </p>
    </div>
  )
}

export default Testimonials
