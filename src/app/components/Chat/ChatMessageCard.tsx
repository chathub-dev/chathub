import cx from 'classnames'
import { FC, memo } from 'react'
import { BeatLoader } from 'react-spinners'
import { ChatMessageModel } from '~/types'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'

interface Props {
  message: ChatMessageModel
}

const ChatMessageCard: FC<Props> = ({ message }) => {
  return (
    <div className={cx('flex gap-3 w-full', message.author === 'user' ? 'flex-row-reverse' : 'flex-row')}>
      <div className="flex flex-col w-4/5 max-w-fit items-start gap-2">
        <MessageBubble color={message.author === 'user' ? 'primary' : 'flat'}>
          {message.text ? (
            <Markdown>{message.text}</Markdown>
          ) : (
            !message.error && <BeatLoader size={10} className="leading-tight" />
          )}
          {!!message.error && <p className="text-[#e00]">{message.error.message}</p>}
        </MessageBubble>
        {!!message.error && <ErrorAction error={message.error} />}
      </div>
    </div>
  )
}

export default memo(ChatMessageCard)
