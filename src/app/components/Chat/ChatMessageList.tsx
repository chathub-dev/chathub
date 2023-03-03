import { FC } from 'react'
import cx from 'classnames'
import ScrollToBottom from 'react-scroll-to-bottom'
import { BotId } from '~app/bots'
import { ChatMessageModel } from '~types'
import ChatMessageCard from './ChatMessageCard'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  className?: string
}

const ChatMessageList: FC<Props> = (props) => {
  return (
    <ScrollToBottom className="overflow-scroll h-full mt-5">
      <div className={cx('flex flex-col gap-4 h-full', props.className)}>
        {props.messages.map((message) => {
          return <ChatMessageCard key={message.id} message={message} />
        })}
      </div>
    </ScrollToBottom>
  )
}

export default ChatMessageList
