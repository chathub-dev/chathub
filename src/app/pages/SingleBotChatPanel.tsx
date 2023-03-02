import { FC } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botId: BotId
}

const SingleBotChatPanel: FC<Props> = ({ botId }) => {
  const { messages, sendMessage, generating, stopGenerating } = useChat(botId, 'single')
  return (
    <div>
      <ConversationPanel
        botId={botId}
        messages={messages}
        onUserSendMessage={sendMessage}
        generating={generating}
        stopGenerating={stopGenerating}
      />
    </div>
  )
}

export default SingleBotChatPanel
