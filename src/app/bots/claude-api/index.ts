import { requestHostPermission } from '~app/utils/permissions'
import { ClaudeAPIModel, UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationContext {
  messages: ConversationMessage[]
}

export class ClaudeApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(private config: Pick<UserConfig, 'claudeApiKey' | 'claudeApiModel'>) {
    super()
  }

  async fetchCompletionApi(messages: ConversationMessage[], signal?: AbortSignal) {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.config.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.getModelName(),
        max_tokens: 8096,
        messages,
        stream: true,
      }),
    })
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.anthropic.com/'))) {
      throw new ChatError('Missing anthropic.com permission', ErrorCode.UNKOWN_ERROR)
    }

    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    this.conversationContext.messages.push({ role: 'user', content: params.prompt })

    const resp = await this.fetchCompletionApi(this.conversationContext.messages, params.signal)

    let result = ''

    await parseSSEResponse(resp, (message) => {
      console.debug('claude sse message', message)
      const data = JSON.parse(message)
      if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
        result += data.delta.text
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: result } })
      } else if (data.type === 'message_stop') {
        // stream done
      } else if (data.type === 'error') {
        throw new ChatError(JSON.stringify(data.error), ErrorCode.UNKOWN_ERROR)
      }
    })

    params.onEvent({ type: 'DONE' })
    this.conversationContext.messages.push({ role: 'assistant', content: result })
  }

  private getModelName() {
    switch (this.config.claudeApiModel) {
      case ClaudeAPIModel['claude-instant-1']:
        return 'claude-3-haiku-20240307'
      case ClaudeAPIModel['claude-2']:
      default:
        return 'claude-3-5-sonnet-20241022'
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return `Claude (API/${this.config.claudeApiModel})`
  }
}
