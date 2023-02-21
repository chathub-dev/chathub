import { Alert, Avatar } from '@chakra-ui/react'
import 'github-markdown-css'
import { FC, useMemo } from 'react'
import { ChatMessageModel } from '~/types'
import { CHATBOTS } from '../../consts'
import Markdown from '../Markdown'

interface Props {
  message: ChatMessageModel
}

const ChatMessageCard: FC<Props> = ({ message }) => {
  const user = useMemo(() => {
    if (message.author === 'chatgpt') {
      return CHATBOTS.chatgpt
    }
    if (message.author === 'bing') {
      return CHATBOTS.bing
    }
  }, [message])
  return (
    <div className="flex flex-row gap-3 w-full">
      <div>
        <Avatar src={user?.avatar} size="sm" />
      </div>
      <div className="flex flex-col w-full">
        <span className="text-sm opacity-50 mb-1">{user?.name || 'You'}</span>
        {!!message.text && <Markdown>{message.text}</Markdown>}
        {!!message.error && (
          <Alert status="error" variant="left-accent" className="text-sm">
            {message.error}
          </Alert>
        )}
        {!message.text && !message.error && <p className="animate-pulse">...</p>}
      </div>
    </div>
  )
}

export default ChatMessageCard
