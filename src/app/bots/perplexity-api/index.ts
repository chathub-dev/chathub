import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationContext {
  messages: ChatMessage[]
}

export class PerplexityApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(
    public apiKey: string,
    public model: string,
  ) {
    super()
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    const message: ChatMessage = { role: 'user', content: params.prompt }
    const resp = await this.fetchCompletionApi([...this.conversationContext.messages, message], params.signal)

    // add user message to context only after fetch success
    this.conversationContext.messages.push(message)

    let answer: string = ''

    await parseSSEResponse(resp, (message) => {
      console.debug('pplx sse message', message)
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      if (data?.choices?.length) {
        const message = data.choices[0].message
        if (message.role === 'assistant' && message.content) {
          answer = message.content
          params.onEvent({ type: 'UPDATE_ANSWER', data: { text: answer } })
        }
      }
    })

    this.conversationContext.messages.push({ role: 'assistant', content: answer })
    params.onEvent({ type: 'DONE' })
  }

  private async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    return fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      signal,
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return 'Perplexity (API)'
  }
}
