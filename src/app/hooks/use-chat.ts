import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { chatFamily } from '~app/state'
import { compressImageFile } from '~app/utils/image-compression'
import { setConversationMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { ChatError } from '~utils/errors'

export function useChat(index: number) {
  const chatAtom = useMemo(() => chatFamily({ index, page: 'singleton' }), [index])
  const [chatState, setChatState] = useAtom(chatAtom)

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
    async (input: string, images?: File[]) => {

      const botMessageId = uuid()
      setChatState((draft) => {
        draft.messages.push(
          { id: uuid(), text: input, images, author: 'user' },
          { id: botMessageId, text: '', author: index }, // Use index as author
        )
      })

      const abortController = new AbortController()
      setChatState((draft) => {
        draft.generatingMessageId = botMessageId
        draft.abortController = abortController
      })

      let compressedImages: File[] | undefined = undefined
      if (images && images.length > 0) {
        compressedImages = await Promise.all(images.map(compressImageFile))
      }
      
      const resp = await chatState.bot.sendMessage({
        prompt: input,
        images: compressedImages,
        signal: abortController.signal,
      })

      try {
        for await (const answer of resp) {
          updateMessage(botMessageId, (message) => {
            message.text = answer.text
            if (answer.thinking) {
              message.thinking = answer.thinking
            }
          })
        }
      } catch (err: unknown) {
        if (!abortController.signal.aborted) {
          abortController.abort()
        }
        const error = err as ChatError
        console.error('sendMessage error', error.code, error)
        updateMessage(botMessageId, (message) => {
          message.error = error
        })
        setChatState((draft) => {
          draft.abortController = undefined
          draft.generatingMessageId = ''
        })
      }

      setChatState((draft) => {
        draft.abortController = undefined
        draft.generatingMessageId = ''
      })
    },
    [index, chatState.bot, setChatState, updateMessage],
  )

  const modifyLastMessage = useCallback(
    async (text: string) => {
      chatState.bot.modifyLastMessage(text)

    // 最後のボットメッセージを見つけて更新
    setChatState((draft) => {
      const lastBotMessage = [...draft.messages].reverse().find(m => m.author === index) // Use index to find bot message
      if (lastBotMessage) {
        lastBotMessage.text = text
      }
    })

  }, [chatState.bot, setChatState])

  const resetConversation = useCallback(() => {
    chatState.bot.resetConversation()
    setChatState((draft) => {
      draft.abortController = undefined
      draft.generatingMessageId = ''
      draft.messages = []
      draft.conversationId = uuid()
    })
  }, [chatState.bot, setChatState])

  const stopGenerating = useCallback(() => {
    chatState.abortController?.abort()
    if (chatState.generatingMessageId) {
      updateMessage(chatState.generatingMessageId, (message) => {
        if (!message.text && !message.error) {
          message.text = 'Cancelled'
        }
      })
    }
    setChatState((draft) => {
      draft.generatingMessageId = ''
    })
  }, [chatState.abortController, chatState.generatingMessageId, setChatState, updateMessage])

  useEffect(() => {
    if (chatState.messages.length) {
      setConversationMessages(index, chatState.conversationId, chatState.messages)
    }
  }, [index, chatState.conversationId, chatState.messages])

  // AsyncAbstractBotの初期化状態を監視するためのstate
  const [botInitialized, setBotInitialized] = useState(false)

  // ボットの初期化状態を定期的にチェック
  useEffect(() => {
    if ('isInitialized' in chatState.bot) {
      const checkInitialization = () => {
        const initialized = chatState.bot.isInitialized
        if (initialized !== botInitialized) {
          setBotInitialized(initialized)
        }
      }
      
      // 初期チェック
      checkInitialization()
      
      // 定期的にチェック（初期化完了まで）
      const interval = setInterval(() => {
        checkInitialization()
        if (chatState.bot.isInitialized) {
          clearInterval(interval)
        }
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      setBotInitialized(true) // 通常のAbstractBotの場合は常に初期化済み
    }
  }, [chatState.bot, botInitialized])

  const chat = useMemo(
    () => ({
      index,
      bot: chatState.bot,
      messages: chatState.messages,
      sendMessage,
      resetConversation,
      generating: !!chatState.generatingMessageId,
      stopGenerating,
      modifyLastMessage,
      isInitialized: botInitialized
    }),
    [
      index,
      chatState.bot,
      chatState.generatingMessageId,
      chatState.messages,
      resetConversation,
      sendMessage,
      stopGenerating,
      modifyLastMessage,
      botInitialized
    ],
  )

  return chat
}
