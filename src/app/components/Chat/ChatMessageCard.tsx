import cx from 'classnames'
import { FC, useMemo } from 'react'
import { BeatLoader } from 'react-spinners'
import userAvatar from '~assets/user-avatar.svg'
import { ChatMessageModel } from '~/types'
import { CHATBOTS } from '../../consts'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'

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
    <div className={cx('flex gap-3 w-full', message.author === 'user' ? 'flex-row-reverse' : 'flex-row')}>
      <img src={user.avatar} className="w-10 h-10 object-contain rounded-full" />
      <div className="flex flex-col w-4/5 max-w-fit items-start gap-2">
        <MessageBubble color={message.author === 'user' ? 'primary' : 'flat'}>
          {message.text ? <Markdown>{message.text}</Markdown> : !message.error && <BeatLoader size={10} />}
          {!!message.error && <p className="text-[#e00]">{message.error.message}</p>}
        </MessageBubble>
        {!!message.error && <ErrorAction error={message.error} />}
      </div>
    </div>
  )
}

export default ChatMessageCard
