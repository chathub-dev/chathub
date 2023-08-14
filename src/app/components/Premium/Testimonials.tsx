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
      <p className="italic text-sm text-center text-secondary-text w-2/3">
        &quot;What a great idea AND implementation - to have all the major chats on one page&quot; - Chad Tunis
      </p>
    </div>
  )
}

export default Testimonials
