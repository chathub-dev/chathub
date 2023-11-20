export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'high' } }

export type ChatMessage =
  | {
      role: 'system' | 'assistant'
      content: string
    }
  | {
      role: 'user'
      content: string | ContentPart[]
    }
