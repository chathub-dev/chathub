import { FC } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botId: BotId
}

const SingleBotChatPanel: FC<Props> = ({ botId }) => {
  const { messages, sendMessage, replying } = useChat(botId, 'single')
  return <ConversationPanel botId={botId} messages={messages} onUserSendMessage={sendMessage} replying={replying} />
}

export default SingleBotChatPanel
