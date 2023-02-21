import { Avatar } from '@chakra-ui/react'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import ReactMarkdown from 'react-markdown'
import { FC, useMemo } from 'react'
import 'github-markdown-css'
import { ChatMessageModel } from '~/types'
import { CHATBOTS } from '../../consts'
import classes from './card.module.css'

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
    <div className="flex flex-row gap-3">
      <div>
        <Avatar src={user?.avatar} size="sm" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm opacity-50">{user?.name || 'You'}</span>
        <ReactMarkdown
          remarkPlugins={[supersub, remarkGfm]}
          className={`markdown-body ${classes.markdown}`}
          linkTarget="_blank"
        >
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ChatMessageCard
