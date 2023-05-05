import cx from 'classnames'
import { useAtomValue } from 'jotai'
import { uniqBy } from 'lodash-es'
import { FC, Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import { useChat } from '~app/hooks/use-chat'
import { useUserConfig } from '~app/hooks/use-user-config'
import { multiPanelBotsAtom } from '~app/state'
import { MultiPanelLayout } from '~services/user-config'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

const GeneralChatPanel: FC<{ chats: ReturnType<typeof useChat>[] }> = ({ chats }) => {
  const { t } = useTranslation()
  const generating = useMemo(() => chats.some((c) => c.generating), [chats])

  const onUserSendMessage = useCallback(
    (input: string, botId?: BotId) => {
      if (botId) {
        const chat = chats.find((c) => c.botId === botId)
        chat?.sendMessage(input)
      } else {
        uniqBy(chats, (c) => c.botId).forEach((c) => c.sendMessage(input))
      }
    },
    [chats],
  )

  return (
    <div className="flex flex-col overflow-hidden">
      <div
        className={cx(
          'grid overflow-hidden grow auto-rows-fr',
          chats.length > 2 ? 'gap-3 mb-3' : 'gap-5 mb-5',
          chats.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
        )}
      >
        {chats.map((chat, index) => (
          <ConversationPanel
            key={`${chat.botId}-${index}`}
            botId={chat.botId}
            messages={chat.messages}
            onUserSendMessage={onUserSendMessage}
            generating={chat.generating}
            stopGenerating={chat.stopGenerating}
            mode="compact"
            resetConversation={chat.resetConversation}
            index={index}
          />
        ))}
      </div>
      <ChatMessageInput
        mode="full"
        className="rounded-[25px] bg-primary-background px-[20px] py-[10px]"
        disabled={generating}
        placeholder="Send to all ..."
        onSubmit={onUserSendMessage}
        actionButton={!generating && <Button text={t('Send')} color="primary" type="submit" />}
        autoFocus={true}
      />
    </div>
  )
}

const TwoBotChatPanel: FC = () => {
  const multiPanelBotIds = useAtomValue(multiPanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  return <GeneralChatPanel chats={chats} />
}

const ThreeBotChatPanel: FC = () => {
  const multiPanelBotIds = useAtomValue(multiPanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  return <GeneralChatPanel chats={chats} />
}

const FourBotChatPanel: FC = () => {
  const multiPanelBotIds = useAtomValue(multiPanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chat4 = useChat(multiPanelBotIds[3])
  const chats = useMemo(() => [chat1, chat2, chat3, chat4], [chat1, chat2, chat3, chat4])
  return <GeneralChatPanel chats={chats} />
}

const MultiBotChatPanel: FC = () => {
  const { multiPanelLayout } = useUserConfig()
  if (multiPanelLayout === MultiPanelLayout.Four) {
    return <FourBotChatPanel />
  }
  if (multiPanelLayout === MultiPanelLayout.Three) {
    return <ThreeBotChatPanel />
  }
  return <TwoBotChatPanel />
}

const MultiBotChatPanelPage: FC = () => {
  return (
    <Suspense>
      <MultiBotChatPanel />
    </Suspense>
  )
}

export default MultiBotChatPanelPage
