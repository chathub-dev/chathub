import { cx } from '~/utils'
import { FC, memo, useCallback, useState, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useSWRConfig } from 'swr'
import { deleteHistoryMessage } from '~services/chat-history'
import { getUserConfig } from '~services/user-config'
import { ChatMessageModel } from '~types'
import Markdown from '../Markdown'

interface Props {
  index: number
  message: ChatMessageModel
  conversationId: string
}

const ChatMessage: FC<Props> = ({ index, message, conversationId }) => {
  const { mutate } = useSWRConfig()
  const [botName, setBotName] = useState('Custom Bot')

  useEffect(() => {
    const fetchBotName = async () => {
      const config = await getUserConfig();
      const customConfig = config.customApiConfigs?.[index];
      if (customConfig) {
        setBotName(customConfig.name);
      }
    };
    fetchBotName();
  }, [index]);

  const deleteMessage = useCallback(async () => {
    await deleteHistoryMessage(index, conversationId, message.id)
    mutate(`history:${index}`)
  }, [index, conversationId, message.id, mutate])

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
          {message.author === 'user' ? 'You' : botName}
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
