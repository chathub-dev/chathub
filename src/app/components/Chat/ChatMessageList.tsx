import { FC } from 'react'
import { cx } from '~/utils'
import { StickToBottom } from 'use-stick-to-bottom'
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
    <StickToBottom className="overflow-auto h-full">
      <StickToBottom.Content className={cx('flex flex-col gap-3 h-full', props.className)}>
        {props.messages.map((message, index) => {
          return <ChatMessageCard key={message.id} message={message} className={index === 0 ? 'mt-5' : undefined} />
        })}
      </StickToBottom.Content>
    </StickToBottom>
  )
}

export default ChatMessageList
