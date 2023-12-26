import { FC, Suspense } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botId: BotId
}

const SingleBotChatPanel: FC<Props> = ({ botId }) => {
  const chat = useChat(botId)
  return (
    <div className="overflow-hidden h-full">
      <ConversationPanel
        botId={botId}
        bot={chat.bot}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        resetConversation={chat.resetConversation}
      />
    </div>
  )
}

const SingleBotChatPanelPage: FC<Props> = ({ botId }) => {
  return (
    <Suspense fallback={<div className="bg-primary-background w-full h-full rounded-2xl"></div>}>
      <SingleBotChatPanel botId={botId} />
    </Suspense>
  )
}

export default SingleBotChatPanelPage
