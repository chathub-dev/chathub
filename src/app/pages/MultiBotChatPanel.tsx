import { useAtomValue } from 'jotai'
import { uniqBy } from 'lodash-es'
import { FC, useCallback, useMemo } from 'react'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import { useChat } from '~app/hooks/use-chat'
import { compareBotsAtom } from '~app/state'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

const MultiBotChatPanel: FC = () => {
  const [leftBotId, rightBotId] = useAtomValue(compareBotsAtom)

  const leftChat = useChat(leftBotId)
  const rightChat = useChat(rightBotId)
  const chats = useMemo(() => [leftChat, rightChat], [leftChat, rightChat])

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
      <div className="grid grid-cols-2 gap-5 overflow-hidden grow">
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
        className="rounded-full bg-white dark:bg-gray-800 px-[20px] py-[10px] mt-5"
        disabled={generating}
        placeholder="Send to all ..."
        onSubmit={onUserSendMessage}
        actionButton={!generating && <Button text="Send" color="primary" type="submit" />}
        autoFocus={true}
      />
    </div>
  )
}

export default MultiBotChatPanel
