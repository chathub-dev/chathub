import { useCallback, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { botClasses, BotId } from '../bots'

export function useChat(botId: BotId) {
  const bot = useMemo(() => new botClasses[botId](), [botId])
  const [messages, setMessages] = useImmer<ChatMessageModel[]>([])

  const sendMessage = useCallback(
    (input: string) => {
      const botMessageId = uuid()
      setMessages((draft) => {
        draft.push({ id: uuid(), text: input, author: 'user' }, { id: botMessageId, text: '...', author: botId })
      })
      bot.sendMessage({
        prompt: input,
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
            setMessages((draft) => {
              const message = draft.find((m) => m.id === botMessageId)
              if (message) {
                message.text = event.data.text
              }
            })
          }
        },
      })
    },
    [bot, botId, setMessages],
  )

  return { messages, sendMessage }
}
