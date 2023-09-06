import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { uuid } from '~utils'
import { generateMessageId, generateSessionId, getUserInfo } from './api'
import { streamAsyncIterable } from '~utils/stream-async-iterable'

interface Message {
  id: string
  createdAt: number
  data: string
  from: 0 | 1 // human | bot
}

interface ConversationContext {
  conversationId: string
  historyMessages: Message[]
  userId: number
  lastMessageId?: string
}

export class BaichuanWebBot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.baichuan-ai.com/'))) {
      throw new ChatError('Missing baichuan-ai.com permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.conversationContext) {
      const conversationId = generateSessionId()
      const userInfo = await getUserInfo()
      this.conversationContext = { conversationId, historyMessages: [], userId: userInfo.id }
    }

    const { conversationId, lastMessageId, historyMessages, userId } = this.conversationContext

    const message: Message = {
      id: generateMessageId(),
      createdAt: Date.now(),
      data: params.prompt,
      from: 0,
    }

    const resp = await fetch('https://www.baichuan-ai.com/api/chat/v1/chat', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: true,
        request_id: uuid(),
        app_info: { id: 10001, name: 'baichuan_web' },
        user_info: { id: userId, status: 1 },
        prompt: {
          id: message.id,
          data: message.data,
          from: message.from,
          parent_id: lastMessageId || 0,
          created_at: message.createdAt,
        },
        session_info: { id: conversationId, name: '新的对话', created_at: Date.now() },
        parameters: {
          repetition_penalty: -1,
          temperature: -1,
          top_k: -1,
          top_p: -1,
          max_new_tokens: -1,
          do_sample: -1,
          regenerate: 0,
        },
        history: historyMessages,
      }),
    })

    const decoder = new TextDecoder()
    let result = ''
    let answerMessageId: string | undefined

    for await (const uint8Array of streamAsyncIterable(resp.body!)) {
      const str = decoder.decode(uint8Array)
      console.debug('baichuan', str)
      const lines = str.split('\n')
      for (const line of lines) {
        if (!line) {
          continue
        }
        const data = JSON.parse(line)
        answerMessageId = data.answer.id
        const text = data.answer.data
        if (text) {
          result += text
          params.onEvent({ type: 'UPDATE_ANSWER', data: { text: result } })
        }
      }
    }

    this.conversationContext.historyMessages.push(message)
    if (answerMessageId) {
      this.conversationContext.lastMessageId = answerMessageId
      if (result) {
        this.conversationContext.historyMessages.push({
          id: answerMessageId,
          data: result,
          createdAt: Date.now(),
          from: 1,
        })
      }
    }

    params.onEvent({ type: 'DONE' })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return '百川大模型'
  }
}
