import WebSocketAsPromised from 'websocket-as-promised'
import { requestHostPermissions } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createSession } from './api'

interface ConversationContext {
  wsp: WebSocketAsPromised
}

export class PerplexityLabsBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(public model: string) {
    super()
  }

  private buildMessage(prompt: string) {
    const params = [
      'perplexity_playground',
      {
        version: '2.1',
        source: 'default',
        model: this.model,
        messages: [{ role: 'user', content: prompt, priority: 0 }],
      },
    ]
    return `42${JSON.stringify(params)}`
  }

  private async setupWebsocket(sessionId: string): Promise<WebSocketAsPromised> {
    const wsp = new WebSocketAsPromised(
      `wss://labs-api.perplexity.ai/socket.io/?EIO=4&transport=websocket&sid=${sessionId}`,
    )
    return new Promise((resolve, reject) => {
      wsp.onOpen.addListener(() => {
        wsp.send('2probe')
        wsp.send('5')
      })
      wsp.onMessage.addListener((data: string) => {
        if (data === '2') {
          wsp.send('3')
        } else if (data === '6') {
          resolve(wsp)
        }
      })
      wsp.open().catch(reject)
    })
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermissions(['https://*.perplexity.ai/', 'wss://*.perplexity.ai/']))) {
      throw new ChatError('Missing perplexity.ai permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.conversationContext) {
      const sessionId = await createSession()
      const wsp = await this.setupWebsocket(sessionId)
      this.conversationContext = { wsp }
    }

    const { wsp } = this.conversationContext

    const listener = (data: string) => {
      console.debug('pplx ws data', data)
      if (!data.startsWith('42')) {
        return
      }
      const payload = JSON.parse(data.slice(2))
      if (payload[0] !== 'pplx-70b-online_query_progress') {
        return
      }
      const chunk = payload[1]
      if (chunk.output) {
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: chunk.output } })
      }
      if (chunk.status === 'completed') {
        wsp.onMessage.removeListener(listener)
        params.onEvent({ type: 'DONE' })
      }
      if (chunk.status === 'failed') {
        wsp.onMessage.removeListener(listener)
        params.onEvent({ type: 'ERROR', error: new ChatError('failed', ErrorCode.UNKOWN_ERROR) })
      }
    }

    wsp.onMessage.addListener(listener)
    wsp.send(this.buildMessage(params.prompt))
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return 'Perplexity'
  }
}
