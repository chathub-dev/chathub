export interface ChatMessageModel {
  id: string
  author: string
  text: string
  metadata?: unknown
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
