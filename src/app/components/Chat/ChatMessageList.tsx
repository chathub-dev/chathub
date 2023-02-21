import { FC } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { BotId } from '~app/bots'
import { ChatMessageModel } from '~types'
import ChatMessageCard from './ChatMessageCard'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
}

const MessageList: FC<Props> = (props) => {
  return (
    <ScrollToBottom className="overflow-scroll h-full">
      <div className="mx-auto flex flex-col gap-3 px-10 h-full">
        {props.messages.map((message) => {
          return <ChatMessageCard key={message.id} message={message} />
        })}
      </div>
    </ScrollToBottom>
  )
}

export default MessageList
