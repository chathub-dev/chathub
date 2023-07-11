import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

export class PiBot extends AbstractBot {
  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.pi.ai/'))) {
      throw new ChatError('Missing pi.ai permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    const resp = await fetch('https://pi.ai/api/chat', {
      method: 'POST',
      signal: params.signal,
      body: JSON.stringify({ text: params.prompt }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await parseSSEResponse(resp, (message) => {
      console.debug('pi sse', message)
      const data = JSON.parse(message)
      if (data.text) {
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: data.text } })
      }
    })

    params.onEvent({ type: 'DONE' })
  }

  resetConversation() {
    // TODO
  }
}
