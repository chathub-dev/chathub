import { FC, PropsWithChildren } from 'react'
import { cx } from '~utils'

const Blockquote: FC<PropsWithChildren<{ className?: string }>> = (props) => {
  return (
    <blockquote className={cx('text-sm border-l-4 border-gray-300 pl-2 italic', props.className)}>
      {props.children}
    </blockquote>
  )
}

export default Blockquote
