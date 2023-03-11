import cx from 'classnames'
import { FC, PropsWithChildren } from 'react'

interface Props {
  color: 'primary' | 'flat'
  className?: string
}

const MessageBubble: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <div
      className={cx(
        'rounded-[15px] px-4 py-2',
        props.color === 'primary' ? 'bg-[#4987FC] text-white' : 'bg-[#F2F2F2] text-[#303030]',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

export default MessageBubble
