import { requestHostPermission } from '~app/utils/permissions'
import { Base64 } from 'js-base64'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createConversation, getGeeToken } from './api'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'

interface ConversationContext {
  geeToken: string
  chatId: number
}

function generateFD() {
  const ms = String(+new Date())
  return ms.substring(ms.length - 6)
}

export class XunfeiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.xfyun.cn/'))) {
      throw new ChatError('Missing xfyun.cn permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.conversationContext) {
      const [geeToken, { chatId }] = await Promise.all([getGeeToken(), createConversation()])
      this.conversationContext = { geeToken, chatId }
    }

    const form = new FormData()
    form.append('chatId', this.conversationContext.chatId.toString())
    form.append('text', params.prompt)
    form.append('clientType', '1')
    form.append('GtToken', this.conversationContext.geeToken)
    form.append('fd', generateFD())

    const resp = await fetch('https://xinghuo.xfyun.cn/iflygpt/u/chat_message/chat', {
      method: 'POST',
      signal: params.signal,
      body: form,
    })

    let answer = ''
    let done = false

    await parseSSEResponse(resp, (message) => {
      console.debug('xunfei sse', message)
      if (message === '<end>') {
        done = true
        params.onEvent({ type: 'DONE' })
      } else if (!done) {
        const decoded = Base64.decode(message)
        answer += decoded
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: answer } })
      }
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
