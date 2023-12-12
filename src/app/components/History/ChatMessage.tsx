import { FC, memo, useCallback } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useSWRConfig } from 'swr'
import { CHATBOTS } from '~/app/bots'
import { cx } from '~/utils'
import { BotId } from '~app/bots'
import { deleteHistoryMessage } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import Markdown from '../Markdown'

interface Props {
  botId: BotId
  message: ChatMessageModel
  conversationId: string
}

const ChatMessage: FC<Props> = ({ botId, message, conversationId }) => {
  const { mutate } = useSWRConfig()

  const deleteMessage = useCallback(async () => {
    await deleteHistoryMessage(botId, conversationId, message.id)
    mutate(`history:${botId}`)
  }, [botId, conversationId, message.id, mutate])

  if (!message.text) {
    return null
  }

  return (
    <div
      className={cx(
        'group relative py-5 flex flex-col gap-1 px-5 text-primary-text',
        message.author === 'user' ? 'bg-secondary' : 'bg-primary-background',
      )}
    >
      <div className="flex flex-row justify-between">
        <span className="text-xs text-secondary-tex">
          {message.author === 'user' ? 'You' : CHATBOTS[message.author].name}
        </span>
        {!!conversationId && (
          <FiTrash2 className="invisible group-hover:visible cursor-pointer" onClick={deleteMessage} />
        )}
      </div>
      <Markdown>{message.text}</Markdown>
    </div>
  )
}

export default memo(ChatMessage)
