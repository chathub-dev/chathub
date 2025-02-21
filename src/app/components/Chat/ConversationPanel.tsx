import { motion } from 'framer-motion'
import { FC, ReactNode, useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import clearIcon from '~/assets/icons/clear.svg'
import historyIcon from '~/assets/icons/history.svg'
import shareIcon from '~/assets/icons/share.svg'
import { cx } from '~/utils'
import { CHATBOTS } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { ChatMessageModel } from '~types'
import { BotId, BotInstance } from '../../bots'
import Button from '../Button'
import HistoryDialog from '../History/Dialog'
import ShareDialog from '../Share/Dialog'
import Tooltip from '../Tooltip'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'
import ChatbotName from './ChatbotName'
import WebAccessCheckbox from './WebAccessCheckbox'
import { getUserConfig } from '~services/user-config'

interface Props {
  botId: BotId
  bot: BotInstance
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, image?: File) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  mode?: 'full' | 'compact'
  onSwitchBot?: (botId: BotId) => void
  onPropaganda?: (text: string) => Promise<void> 
}

const ConversationPanel: FC<Props> = (props) => {
  const { t } = useTranslation()
  const botInfo = CHATBOTS[props.botId]
  const mode = props.mode || 'full'
  const marginClass = 'mx-3'
  const [showHistory, setShowHistory] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  // ボット名とアバターを保持するための状態を追加
  const [botName, setBotName] = useState<string>(CHATBOTS[props.botId].name)
  const [botAvatar, setBotAvatar] = useState<string>(CHATBOTS[props.botId].avatar)

  // コンポーネントマウント時に設定を取得
  useEffect(() => {
    const initializeBotInfo = async () => {
      const config = await getUserConfig();
      const customApiConfigs = config.customApiConfigs || [];

      // botId から対応する rakutenApiConfigs のインデックスを取得
      const index = Number(props.botId.replace('customchat', '')) - 1;
      
      // インデックスが有効な範囲内かどうかを確認
      if (index >= 0 && index < customApiConfigs.length) {
        setBotName(customApiConfigs[index].name);
        // アバター情報も設定
        if (customApiConfigs[index].avatar) {
          setBotAvatar(customApiConfigs[index].avatar);
        }
      }
    };
  
  initializeBotInfo();
  }, [props.botId]); // props.botId が変更されたときに再実行

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string, image?: File) => {
      props.onUserSendMessage(input as string, image)
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
  }, [props.botId])

  const openShareDialog = useCallback(() => {
    setShowShareDialog(true)
  }, [props.botId])

  let inputActionButton: ReactNode = null
  if (props.generating) {
    inputActionButton = (
      <Button text={t('Stop')} color="flat" size={mode === 'full' ? 'normal' : 'tiny'} onClick={props.stopGenerating} />
    )
  } else if (mode === 'full') {
    inputActionButton = (
      <div className="flex flex-row items-center gap-[10px] shrink-0">
        <Button text={t('Send')} color="primary" type="submit" />
      </div>
    )
  }

  return (
    <ConversationContext.Provider value={context}>
      <div className={cx('flex flex-col overflow-hidden bg-primary-background h-full rounded-2xl')}>
        <div
          className={cx(
            'border-b border-solid border-primary-border flex flex-row items-center justify-between gap-2 py-[10px]',
            marginClass,
          )}
        >
          <div className="flex flex-row items-center">
            <motion.img
              src={botAvatar}
              className="w-[18px] h-[18px] object-contain rounded-sm mr-2"
              whileHover={{ rotate: 180 }}
            />
            <ChatbotName
              botId={props.botId}
              name={props.bot.chatBotName ?? botName}
              fullName={props.bot.name}
              model={props.bot.modelName ?? 'Default'}
              onSwitchBot={mode === 'compact' ? props.onSwitchBot : undefined}
            />
          </div>
          <WebAccessCheckbox botId={props.botId} />
          <div className="flex flex-row items-center gap-3">
            <Tooltip content={t('Share conversation')}>
              <motion.img
                src={shareIcon}
                className="w-5 h-5 cursor-pointer"
                onClick={openShareDialog}
                whileHover={{ scale: 1.1 }}
              />
            </Tooltip>
            <Tooltip content={t('Clear conversation')}>
              <motion.img
                src={clearIcon}
                className={cx('w-5 h-5', props.generating ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={resetConversation}
                whileHover={{ scale: 1.1 }}
              />
            </Tooltip>
            <Tooltip content={t('View history')}>
              <motion.img
                src={historyIcon}
                className="w-5 h-5 cursor-pointer"
                onClick={openHistoryDialog}
                whileHover={{ scale: 1.1 }}
              />
            </Tooltip>
          </div>
        </div>
        <ChatMessageList
          botId={props.botId}
          messages={props.messages}
          className={marginClass}
          onPropaganda={props.onPropaganda}
        />
        <div className={cx('mt-3 flex flex-col ', marginClass, mode === 'full' ? 'mb-3' : 'mb-[5px]')}>
          <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-3' : 'mb-0')}>
            {mode === 'compact' && (
              <span className="font-medium text-xs text-light-text cursor-default">Send to {botInfo.name}</span>
            )}
            <hr className="grow border-primary-border" />
          </div>
          <ChatMessageInput
            mode={mode}
            disabled={props.generating}
            placeholder={mode === 'compact' ? '' : undefined}
            onSubmit={onSubmit}
            autoFocus={mode === 'full'}
            supportImageInput={mode === 'full' && props.bot.supportsImageInput}
            actionButton={inputActionButton}
          />
        </div>
      </div>
      {showShareDialog && (
        <ShareDialog open={true} onClose={() => setShowShareDialog(false)} messages={props.messages} />
      )}
      {showHistory && <HistoryDialog botId={props.botId} open={true} onClose={() => setShowHistory(false)} />}
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
