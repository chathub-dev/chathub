import cx from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clearIcon from '~/assets/icons/clear.svg'
import historyIcon from '~/assets/icons/history.svg'
import shareIcon from '~/assets/icons/share.svg'
import { CHATBOTS } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { trackEvent } from '~app/plausible'
import { ChatMessageModel } from '~types'
import { BotId, BotInstance } from '../../bots'
import Button from '../Button'
import HistoryDialog from '../History/Dialog'
import ShareDialog from '../Share/Dialog'
import SwitchBotDropdown from '../SwitchBotDropdown'
import Tooltip from '../Tooltip'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'

interface Props {
  botId: BotId
  bot: BotInstance
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId, image?: File) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  mode?: 'full' | 'compact'
  onSwitchBot?: (botId: BotId) => void
}

const ConversationPanel: FC<Props> = (props) => {
  const { t } = useTranslation()
  const botInfo = CHATBOTS[props.botId]
  const mode = props.mode || 'full'
  const marginClass = 'mx-5'
  const [showHistory, setShowHistory] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string, image?: File) => {
      props.onUserSendMessage(input as string, props.botId, image)
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

  const openShareDialog = useCallback(() => {
    setShowShareDialog(true)
    trackEvent('open_share_dialog', { botId: props.botId })
  }, [props.botId])

  return (
    <ConversationContext.Provider value={context}>
      <div className={cx('flex flex-col overflow-hidden bg-primary-background h-full rounded-[20px]')}>
        <div
          className={cx(
            'border-b border-solid border-primary-border flex flex-row items-center justify-between gap-2 py-[10px]',
            marginClass,
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <img src={botInfo.avatar} className="w-[18px] h-[18px] object-contain rounded-full" />
            <Tooltip content={props.bot.name || botInfo.name}>
              <span className="font-semibold text-primary-text text-sm cursor-default">{botInfo.name}</span>
            </Tooltip>
            {mode === 'compact' && props.onSwitchBot && (
              <SwitchBotDropdown selectedBotId={props.botId} onChange={props.onSwitchBot} />
            )}
          </div>
          <div className="flex flex-row items-center gap-3">
            <Tooltip content={t('Share conversation')}>
              <img src={shareIcon} className="w-5 h-5 cursor-pointer" onClick={openShareDialog} />
            </Tooltip>
            <Tooltip content={t('Clear conversation')}>
              <img
                src={clearIcon}
                className={cx('w-5 h-5', props.generating ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={resetConversation}
              />
            </Tooltip>
            <Tooltip content={t('View history')}>
              <img src={historyIcon} className="w-5 h-5 cursor-pointer" onClick={openHistoryDialog} />
            </Tooltip>
          </div>
        </div>
        <ChatMessageList botId={props.botId} messages={props.messages} className={marginClass} />
        <div className={cx('mt-3 flex flex-col', marginClass, mode === 'full' ? 'mb-3' : 'mb-[5px]')}>
          <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-3' : 'mb-0')}>
            {mode === 'compact' && <span className="font-medium text-xs text-light-text">Send to {botInfo.name}</span>}
            <hr className="grow border-primary-border" />
          </div>
          <ChatMessageInput
            mode={mode}
            disabled={props.generating}
            placeholder={mode === 'compact' ? '' : undefined}
            onSubmit={onSubmit}
            autoFocus={mode === 'full'}
            supportImageInput={mode === 'full' && (props.botId === 'bard' || props.botId === 'bing')}
            actionButton={
              props.generating ? (
                <Button
                  text={t('Stop')}
                  color="flat"
                  size={mode === 'full' ? 'normal' : 'small'}
                  onClick={props.stopGenerating}
                />
              ) : (
                mode === 'full' && <Button text={t('Send')} color="primary" type="submit" />
              )
            }
          />
        </div>
      </div>
      {showHistory && <HistoryDialog botId={props.botId} open={true} onClose={() => setShowHistory(false)} />}
      {showShareDialog && (
        <ShareDialog open={true} onClose={() => setShowShareDialog(false)} messages={props.messages} />
      )}
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
