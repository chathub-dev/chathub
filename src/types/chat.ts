import { BotId } from '~app/bots'

export interface ChatMessageModel {
  id: string
  author: BotId | 'user'
  text: string
  error?: string
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
