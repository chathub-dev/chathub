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
        props.color === 'primary' ? 'bg-[var(--bg-1)] text-white' : 'bg-[var(--bg-4)] text-[var(--text-1)]',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

export default MessageBubble
