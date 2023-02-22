import { BotId } from '~app/bots'
import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: BotId | 'user'
  text: string
  error?: ChatError
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
