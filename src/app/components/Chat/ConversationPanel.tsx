import cx from 'classnames'
import { FC, useCallback } from 'react'
import { CHATBOTS } from '~app/consts'
import { ChatMessageModel } from '~types'
import { BotId } from '../../bots'
import Button from '../Button'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  generating: boolean
  stopGenerating: () => void
  mode?: 'full' | 'compact'
}

const ConversationPanel: FC<Props> = (props) => {
  const botInfo = CHATBOTS[props.botId]
  const mode = props.mode || 'full'
  const marginClass = mode === 'compact' ? 'mx-5' : 'mx-10'

  const onSubmit = useCallback(
    async (input: string) => {
      props.onUserSendMessage(input as string, props.botId)
    },
    [props],
  )

  return (
    <div className={cx('flex flex-col overflow-hidden bg-white rounded-[35px] h-full')}>
      <div
        className={cx(
          'text-center border-b border-solid border-[#ededed] h-[80px] flex flex-col justify-center',
          marginClass,
        )}
      >
        <span className="font-semibold text-[#707070] text-sm">{botInfo.name}</span>
      </div>
      <ChatMessageList botId={props.botId} messages={props.messages} className={marginClass} />
      <div className={cx('mt-3 mb-5 flex flex-col', marginClass)}>
        <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-[15px]' : 'mb-[5px]')}>
          {mode === 'compact' && <span className="font-medium text-xs text-[#bebebe]">Send to {botInfo.name}</span>}
          <hr className="grow border-[#ededed]" />
        </div>
        <ChatMessageInput
          disabled={props.generating}
          placeholder={mode === 'compact' ? '' : 'Ask me anything...'}
          onSubmit={onSubmit}
          actionButton={
            props.generating ? (
              <Button text="Stop" color="flat" onClick={props.stopGenerating} />
            ) : (
              mode === 'full' && <Button text="Send" color="primary" type="submit" />
            )
          }
        />
      </div>
    </div>
  )
}

export default ConversationPanel
