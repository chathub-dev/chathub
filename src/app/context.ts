import { createContext } from 'react'

export interface ConversationContextValue {
  reset: () => void
}

export const ConversationContext = createContext<ConversationContextValue | null>(null)
