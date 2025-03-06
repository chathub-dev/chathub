import { BotId } from '~app/bots'
import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: BotId | 'user'
  text: string
  image?: Blob
  error?: ChatError
  thinking?: string
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
