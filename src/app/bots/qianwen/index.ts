import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { createConversation } from './api'
import { uuid } from '~utils'

function generateMessageId() {
  return uuid().replace(/-/g, '')
}

interface ConversationContext {
  conversationId: string
  lastMessageId?: string
}

export class QianwenWebBot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://qianwen.aliyun.com/'))) {
      throw new ChatError('Missing qianwen.aliyun.com permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.conversationContext) {
      const conversationId = await createConversation(params.prompt)
      this.conversationContext = { conversationId }
    }

    const resp = await fetch('https://qianwen.aliyun.com/conversation', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Xsrf-Token': '7a3dae93-1d29-4eb6-9940-34efad5a2b78',
      },
      body: JSON.stringify({
        action: 'next',
        msgId: generateMessageId(),
        parentMsgId: this.conversationContext.lastMessageId || '0',
        contents: [{ contentType: 'text', content: params.prompt }],
        timeout: 17,
        sessionId: this.conversationContext.conversationId,
        model: '',
        userAction: 'chat',
        openSearch: true,
      }),
    })

    let done = false

    await parseSSEResponse(resp, (message) => {
      console.debug('qianwen sse', message)
      const data = JSON.parse(message)
      const text = data.content[0]
      if (text) {
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text } })
      }
      if (data.stopReason === 'stop') {
        this.conversationContext!.lastMessageId = data.msgId
        done = true
        params.onEvent({ type: 'DONE' })
      }
    })

    if (!done) {
      params.onEvent({ type: 'DONE' })
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return '通义千问'
  }
}
