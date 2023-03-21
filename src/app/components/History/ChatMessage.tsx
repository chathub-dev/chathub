import { FC, memo } from 'react'
import cx from 'classnames'
import { ChatMessageModel } from '~types'
import Markdown from '../Markdown'
import { CHATBOTS } from '~/app/consts'

interface Props {
  message: ChatMessageModel
}

const ChatMessage: FC<Props> = ({ message }) => {
  if (!message.text) {
    return null
  }
  return (
    <div className={cx('py-5 flex flex-col gap-1 px-5', message.author !== 'user' && 'bg-[#f2f2f2]')}>
      <span className="text-xs text-[#808080]">
        {message.author === 'user' ? 'You' : CHATBOTS[message.author].name}
      </span>
      <Markdown>{message.text}</Markdown>
    </div>
  )
}

export default memo(ChatMessage)
