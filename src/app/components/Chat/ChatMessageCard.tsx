import { Alert } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { BeatLoader } from 'react-spinners'
import userAvatar from '~assets/user-avatar.svg'
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
    return { name: 'You', avatar: userAvatar }
  }, [message])
  return (
    <div className="flex flex-row gap-3 w-full">
      <img src={user?.avatar} className="w-7 h-7 object-contain rounded-full" />
      <div className="flex flex-col w-full">
        <span className="text-sm opacity-50 mb-1">{user?.name}</span>
        {!!message.text && <Markdown>{message.text}</Markdown>}
        {!!message.error && (
          <Alert status="error" variant="left-accent" className="text-sm">
            {message.error.message}
          </Alert>
        )}
        {!message.text && !message.error && <BeatLoader size={10} />}
      </div>
    </div>
  )
}

export default ChatMessageCard
