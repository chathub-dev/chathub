import WebSocketAsPromised from 'websocket-as-promised'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { html2md } from '~app/utils/markdown'

function generateSessionHash() {
  // https://stackoverflow.com/a/12502559/325241
  return Math.random().toString(36).substring(2)
}

enum FnIndex {
  Send = 7,
  Receive = 8,
}

interface ConversationContext {
  sessionHash: string
}

export class GradioBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(public wsUrl: string, public model: string, public params: number[], public mode?: 'text' | 'html') {
    super()
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      const sessionHash = await this.createSession(params.signal)
      this.conversationContext = { sessionHash }
    }

    const sendWsp = await this.connectWebsocket(
      FnIndex.Send,
      this.conversationContext.sessionHash,
      [null, this.model, params.prompt],
      params.onEvent,
    )
    const receiveWsp = await this.connectWebsocket(
      FnIndex.Receive,
      this.conversationContext.sessionHash,
      [null, ...this.params],
      params.onEvent,
    )

    params.signal?.addEventListener('abort', () => {
      ;[sendWsp, receiveWsp].forEach((wsp) => {
        wsp.removeAllListeners()
        wsp.close()
      })
    })
  }

  async connectWebsocket(fnIndex: number, sessionHash: string, data: unknown[], onEvent: SendMessageParams['onEvent']) {
    const wsp = new WebSocketAsPromised(this.wsUrl, {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data as string),
    })

    wsp.onUnpackedMessage.addListener(async (event) => {
      if (event.msg === 'send_hash') {
        wsp.sendPacked({ fn_index: fnIndex, session_hash: sessionHash })
      } else if (event.msg === 'send_data') {
        wsp.sendPacked({
          fn_index: fnIndex,
          data,
          event_data: null,
          session_hash: sessionHash,
        })
      } else if (event.msg === 'process_generating') {
        if (event.success && event.output.data) {
          if (fnIndex === FnIndex.Receive) {
            const outputData = event.output.data
            if (outputData[1].length > 0) {
              const text = outputData[1][outputData[1].length - 1][1]
              onEvent({
                type: 'UPDATE_ANSWER',
                data: {
                  text: this.mode === 'html' ? html2md(text) : text,
                },
              })
            }
          }
        } else {
          onEvent({ type: 'ERROR', error: new ChatError(event.output.error, ErrorCode.UNKOWN_ERROR) })
        }
      } else if (event.msg === 'queue_full') {
        onEvent({ type: 'ERROR', error: new ChatError('queue_full', ErrorCode.UNKOWN_ERROR) })
      } else if (event.msg === 'process_completed' && fnIndex === FnIndex.Receive && !event.output.data[1].length) {
        onEvent({
          type: 'ERROR',
          error: new ChatError('Session has been inactive for too long', ErrorCode.LMSYS_SESSION_EXPIRED),
        })
      }
    })

    if (fnIndex === FnIndex.Receive) {
      wsp.onClose.addListener(() => {
        wsp.removeAllListeners()
        onEvent({ type: 'DONE' })
      })
    }

    try {
      await wsp.open()
    } catch (err) {
      console.error('lmsys ws open error', err)
      throw new ChatError('Failed to establish websocket connection.', ErrorCode.NETWORK_ERROR)
    }

    return wsp
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  public async createSession(_signal?: AbortSignal) {
    return generateSessionHash()
  }
}
