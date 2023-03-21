import cx from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import clearIcon from '~/assets/icons/clear.svg'
import historyIcon from '~/assets/icons/history.svg'
import { CHATBOTS } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { trackEvent } from '~app/plausible'
import { ChatMessageModel } from '~types'
import { BotId } from '../../bots'
import Button from '../Button'
import HistoryDialog from '../History/Dialog'
import SwitchBotDropdown from '../SwitchBotDropdown'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  mode?: 'full' | 'compact'
  index?: number
}

const ConversationPanel: FC<Props> = (props) => {
  const botInfo = CHATBOTS[props.botId]
  const mode = props.mode || 'full'
  const marginClass = mode === 'compact' ? 'mx-5' : 'mx-10'
  const [showHistory, setShowHistory] = useState(false)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string) => {
      props.onUserSendMessage(input as string, props.botId)
    },
    [props],
  )

  const resetConversation = useCallback(() => {
    if (!props.generating) {
      props.resetConversation()
    }
  }, [props])

  const openHistoryDialog = useCallback(() => {
    setShowHistory(true)
    trackEvent('open_history_dialog', { botId: props.botId })
  }, [props.botId])

  return (
    <ConversationContext.Provider value={context}>
      <div
        className={cx(
          'flex flex-col overflow-hidden bg-white h-full dark:bg-gray-800',
          mode === 'full' ? 'rounded-[35px]' : 'rounded-[20px]',
        )}
      >
        <div
          className={cx(
            'border-b border-solid border-[var(--border-1)] flex flex-row items-center justify-center gap-2 py-3',
            marginClass,
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <img title={botInfo.name} src={botInfo.avatar} className="w-5 h-5 object-contain rounded-full" />
            <span className="font-semibold text-[var(--text-3)] text-sm">{botInfo.name}</span>
            {mode === 'compact' && <SwitchBotDropdown excludeBotId={props.botId} index={props.index!} />}
          </div>
          <div className="flex flex-row items-center gap-3">
            <img
              title='clean'
              src={clearIcon}
              className={cx('w-5 h-5 text-[var(--text-3)]', props.generating ? 'cursor-not-allowed' : 'cursor-pointer')}
              onClick={resetConversation}
            />
            <img title='history' src={historyIcon} className="w-5 h-5 cursor-pointer text-[var(--text-3)]" onClick={openHistoryDialog} />
          </div>
        </div>
        <ChatMessageList botId={props.botId} messages={props.messages} className={marginClass} />
        <div className={cx('mt-3 flex flex-col', marginClass, mode === 'full' ? 'mb-5' : 'mb-[10px]')}>
          <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-[15px]' : 'mb-0')}>
            {mode === 'compact' && (
              <span className="font-medium text-xs text-[var(--text-4)]">Send to {botInfo.name}</span>
            )}
            <hr className="grow border-[var(--border-1)]" />
          </div>
          <ChatMessageInput
            mode={mode}
            disabled={props.generating}
            placeholder={mode === 'compact' ? '' : 'Ask me anything...'}
            onSubmit={onSubmit}
            autoFocus={mode === 'full'}
            actionButton={
              props.generating ? (
                <Button
                  text="Stop"
                  color="flat"
                  size={mode === 'full' ? 'normal' : 'small'}
                  onClick={props.stopGenerating}
                />
              ) : (
                mode === 'full' && <Button text="Send" color="primary" type="submit" />
              )
            }
          />
        </div>
      </div>
      {showHistory && <HistoryDialog botId={props.botId} open={true} onClose={() => setShowHistory(false)} />}
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
