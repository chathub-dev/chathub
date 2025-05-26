import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: number | 'user'
  text: string
  image?: Blob
  error?: ChatError
  thinking?: string
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
