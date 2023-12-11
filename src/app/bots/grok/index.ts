import { FetchError, ofetch } from 'ofetch'
import Browser from 'webextension-polyfill'
import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { streamAsyncIterable } from '~utils/stream-async-iterable'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

const AUTHORIZATION_VALUE =
  'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'

interface StreamMessage {
  result: {
    sender: string
    message: string
    query: string
  }
}

interface ChatMessage {
  sender: 1 | 2
  message: string
}

interface ConversationContext {
  conversationId: string
  messages: ChatMessage[]
}

export class GrokWebBot extends AbstractBot {
  private csrfToken?: string
  private conversationContext?: ConversationContext

  constructor() {
    super()
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.twitter.com/'))) {
      throw new ChatError('Missing twitter.com permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.csrfToken) {
      this.csrfToken = await this.readCsrfToken()
    }

    if (!this.conversationContext) {
      const conversationId = await this.getConversationId()
      this.conversationContext = { conversationId, messages: [] }
    }

    this.conversationContext.messages.push({ sender: 1, message: params.prompt })

    const resp = await fetch('https://api.twitter.com/2/grok/add_response.json', {
      method: 'POST',
      headers: {
        Authorization: AUTHORIZATION_VALUE,
        'x-csrf-token': this.csrfToken!,
      },
      body: JSON.stringify({
        conversationId: this.conversationContext.conversationId,
        responses: this.conversationContext.messages,
        systemPromptName: 'fun',
      }),
      signal: params.signal,
    })

    if (!resp.ok) {
      throw new Error(resp.status.toString() + ' ' + (await resp.text()))
    }

    const decoder = new TextDecoder()
    let result = ''

    for await (const uint8Array of streamAsyncIterable(resp.body!)) {
      const str = decoder.decode(uint8Array)
      console.debug('grok stream', str)
      const lines = str.split('\n')
      for (const line of lines) {
        if (!line) {
          continue
        }
        const payload: StreamMessage = JSON.parse(line)
        if (!result && !payload.result.message && payload.result.query) {
          params.onEvent({ type: 'UPDATE_ANSWER', data: { text: '_' + payload.result.query + '_' } })
        } else {
          const text = payload.result.message
          if (text.startsWith('[link]')) {
            // [link](#tweet=1711679181984346515)\n\n==\n\n[link](#tweet=1663711402643845122)
            // skip special Twitter card message for now
          } else {
            result += text
            params.onEvent({ type: 'UPDATE_ANSWER', data: { text: result } })
          }
        }
      }
    }

    this.conversationContext.messages.push({ sender: 2, message: result })
    params.onEvent({ type: 'DONE' })
  }

  private async getConversationId(): Promise<string> {
    try {
      const resp = await ofetch('https://twitter.com/i/api/2/grok/conversation_id.json', {
        headers: {
          Authorization: AUTHORIZATION_VALUE,
          'x-csrf-token': this.csrfToken!,
        },
      })
      return resp.conversationId
    } catch (err) {
      if (err instanceof FetchError) {
        if (err.status === 401) {
          throw new ChatError('Grok is only available to Twitter Premium+ subscribers', ErrorCode.GROK_UNAVAILABLE)
        }
        if (err.status === 451) {
          throw new ChatError('Grok is not available in your country', ErrorCode.GROK_UNAVAILABLE)
        }
        // csrf & cookie mismatch
        if (err.status === 403) {
          this.csrfToken = await this.readCsrfToken({ refresh: true })
          return this.getConversationId()
        }
      }
      throw err
    }
  }

  private async readCsrfToken({ refresh }: { refresh?: boolean } = {}): Promise<string> {
    const token = await Browser.runtime.sendMessage({
      type: 'read-twitter-csrf-token',
      data: { refresh },
      target: 'background',
    })
    console.debug('twitter csrf token', token)
    if (!token) {
      throw new ChatError('There is no logged-in Twitter account in this browser.', ErrorCode.TWITTER_UNAUTHORIZED)
    }
    return token
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return 'Grok'
  }
}
