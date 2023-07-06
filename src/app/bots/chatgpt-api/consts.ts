export interface ChatMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
}
