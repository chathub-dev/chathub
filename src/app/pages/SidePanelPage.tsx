import cx from 'classnames'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import clearIcon from '~/assets/icons/clear.svg'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import ChatMessageList from '~app/components/Chat/ChatMessageList'
import SwitchBotDropdown from '~app/components/SwitchBotDropdown'
import { CHATBOTS } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { useChat } from '~app/hooks/use-chat'
import { sidePanelBotAtom } from '~app/state'

function SidePanelPage() {
  const { t } = useTranslation()
  const [botId, setBotId] = useAtom(sidePanelBotAtom)
  const botInfo = CHATBOTS[botId]
  const chat = useChat(botId)

  const onSubmit = useCallback(
    async (input: string) => {
      chat.sendMessage(input)
    },
    [chat],
  )

  const resetConversation = useCallback(() => {
    if (!chat.generating) {
      chat.resetConversation()
    }
  }, [chat])

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: resetConversation,
    }
  }, [resetConversation])

  return (
    <ConversationContext.Provider value={context}>
      <div className="flex flex-col overflow-hidden bg-primary-background h-full">
        <div className="border-b border-solid border-primary-border flex flex-row items-center justify-between gap-2 py-3 mx-5">
          <div className="flex flex-row items-center gap-2">
            <img src={botInfo.avatar} className="w-4 h-4 object-contain rounded-full" />
            <span className="font-semibold text-primary-text text-xs">{botInfo.name}</span>
            <SwitchBotDropdown excludeBotId={botId} onChange={setBotId} />
          </div>
          <div className="flex flex-row items-center gap-3">
            <img
              src={clearIcon}
              className={cx('w-4 h-4', chat.generating ? 'cursor-not-allowed' : 'cursor-pointer')}
              onClick={resetConversation}
            />
          </div>
        </div>
        <ChatMessageList botId={botId} messages={chat.messages} className="mx-5" />
        <div className="flex flex-col mx-5 my-3 gap-3">
          <hr className="grow border-primary-border" />
          <ChatMessageInput
            mode="full"
            disabled={chat.generating}
            autoFocus={true}
            placeholder="Ask me anything..."
            onSubmit={onSubmit}
            actionButton={
              chat.generating ? (
                <Button text={t('Stop')} color="flat" size="small" onClick={chat.stopGenerating} />
              ) : (
                <Button text={t('Send')} color="primary" type="submit" size="small" />
              )
            }
          />
        </div>
      </div>
    </ConversationContext.Provider>
  )
}

export default SidePanelPage
