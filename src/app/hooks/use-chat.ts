import { useAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { chatFamily } from '~app/state'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { BotId } from '../bots'

export function useChat(botId: BotId, page: string) {
  const chatAtom = useMemo(() => chatFamily({ botId, page }), [botId, page])
  const [chatState, setChatState] = useAtom(chatAtom)
  const [generating, setGenerating] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | undefined>()

  const updateMessage = useCallback(
    (messageId: string, updater: (message: ChatMessageModel) => void) => {
      setChatState((draft) => {
        const message = draft.messages.find((m) => m.id === messageId)
        if (message) {
          updater(message)
        }
      })
    },
    [setChatState],
  )

  const sendMessage = useCallback(
    async (input: string) => {
      const botMessageId = uuid()
      setChatState((draft) => {
        draft.messages.push(
          { id: uuid(), text: input.replaceAll('\n', '\n\n'), author: 'user' },
          { id: botMessageId, text: '', author: botId },
        )
      })
      const abortController = new AbortController()
      setAbortController(abortController)
      setGenerating(true)
      await chatState.bot.sendMessage({
        prompt: input,
        signal: abortController.signal,
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
            updateMessage(botMessageId, (message) => {
              message.text = event.data.text
            })
          } else if (event.type === 'ERROR') {
            updateMessage(botMessageId, (message) => {
              message.error = event.error
            })
            setAbortController(undefined)
            setGenerating(false)
          } else if (event.type === 'DONE') {
            setAbortController(undefined)
            setGenerating(false)
          }
        },
      })
    },
    [botId, chatState.bot, setChatState, updateMessage],
  )

  const resetConversation = useCallback(() => {
    chatState.bot.resetConversation()
    setChatState((draft) => {
      draft.messages = []
    })
  }, [chatState.bot, setChatState])

  const stopGenerating = useCallback(() => {
    abortController?.abort()
    setGenerating(false)
  }, [abortController])

  return {
    messages: chatState.messages,
    sendMessage,
    resetConversation,
    generating,
    stopGenerating,
  }
}
