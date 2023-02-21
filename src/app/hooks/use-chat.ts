import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { chatFamily } from '~app/state'
import { uuid } from '~utils'
import { BotId } from '../bots'

export function useChat(botId: BotId, page: string) {
  const chatAtom = useMemo(() => chatFamily({ botId, page }), [botId, page])
  const [chatState, setChatState] = useAtom(chatAtom)

  const sendMessage = useCallback(
    (input: string) => {
      const botMessageId = uuid()
      setChatState((draft) => {
        draft.messages.push(
          { id: uuid(), text: input, author: 'user' },
          { id: botMessageId, text: '...', author: botId },
        )
      })
      chatState.bot.sendMessage({
        prompt: input,
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
            setChatState((draft) => {
              const message = draft.messages.find((m) => m.id === botMessageId)
              if (message) {
                message.text = event.data.text
              }
            })
          }
        },
      })
    },
    [botId, chatState.bot, setChatState],
  )

  return {
    messages: chatState.messages,
    sendMessage,
  }
}
