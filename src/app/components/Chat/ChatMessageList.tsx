import { FC } from 'react'
import { cx } from '~/utils'
import ScrollToBottom from 'react-scroll-to-bottom'
import { ChatMessageModel } from '~types'
import ChatMessageCard from './ChatMessageCard'

interface Props {
  index: number
  messages: ChatMessageModel[]
  className?: string
  onPropaganda?: (text: string) => void
}

const ChatMessageList: FC<Props> = (props) => {
  return (
    <ScrollToBottom className="overflow-auto h-full">
      <div className={cx('flex flex-col gap-3 h-full', props.className)}>
        {props.messages.map((message, index) => {
          return (
            <ChatMessageCard
              key={`${message.id}-${message.text}`}
              message={message}
              className={index === 0 ? 'mt-5' : undefined}
              onPropaganda={props.onPropaganda}
            />
          )
        })}
      </div>
    </ScrollToBottom>
  )
}

export default ChatMessageList
