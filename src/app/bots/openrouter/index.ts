import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

interface ChatMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
}

interface ConversationContext {
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 40

export class OpenRouterBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(private config: { apiKey: string; model: string }) {
    super()
  }

  buildMessages(prompt: string): ChatMessage[] {
    return [...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1)), { role: 'user', content: prompt }]
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.openrouter.ai/'))) {
      throw new ChatError('Missing openrouter.ai permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt), params.signal)

    this.conversationContext.messages.push({
      role: 'user',
      content: params.rawUserInput || params.prompt,
    })

    let done = false
    const result: ChatMessage = { role: 'assistant', content: '' }

    const finish = () => {
      done = true
      params.onEvent({ type: 'DONE' })
      const messages = this.conversationContext!.messages
      messages.push(result)
    }

    await parseSSEResponse(resp, (message) => {
      console.debug('openrouter sse message', message)
      if (message === '[DONE]') {
        finish()
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      if (data?.choices?.length) {
        const delta = data.choices[0].delta
        if (delta?.content) {
          result.content += delta.content
          params.onEvent({
            type: 'UPDATE_ANSWER',
            data: { text: result.content },
          })
        }
      }
    })

    if (!done) {
      finish()
    }
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal): Promise<Response> {
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
        'X-Title': 'HuddleLLM',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: true,
      }),
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return `OpenRouter/${this.config.model}`
  }
}
