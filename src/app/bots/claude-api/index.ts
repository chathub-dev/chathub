import { requestHostPermission } from '~app/utils/permissions'
import { ClaudeAPIModel, UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'

interface ConversationContext {
  prompt: string
}

export class ClaudeApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(private config: Pick<UserConfig, 'claudeApiKey' | 'claudeApiModel'>) {
    super()
  }

  async fetchCompletionApi(prompt: string, signal?: AbortSignal) {
    return fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.config.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        prompt,
        model: this.getModelName(),
        max_tokens_to_sample: 100_000,
        stream: true,
      }),
    })
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('https://*.anthropic.com/'))) {
      throw new ChatError('Missing anthropic.com permission', ErrorCode.UNKOWN_ERROR)
    }

    if (!this.conversationContext) {
      this.conversationContext = { prompt: '' }
    }
    this.conversationContext.prompt += `\n\nHuman: ${params.prompt}\n\nAssistant:`

    const resp = await this.fetchCompletionApi(this.conversationContext.prompt, params.signal)

    let result = ''

    await parseSSEResponse(resp, (message) => {
      console.debug('claude sse message', message)
      const data = JSON.parse(message) as { completion: string }
      if (data.completion) {
        result += data.completion
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: result.trimStart() } })
      }
    })

    params.onEvent({ type: 'DONE' })
    this.conversationContext!.prompt += result
  }

  private getModelName() {
    switch (this.config.claudeApiModel) {
      case ClaudeAPIModel['claude-instant-1']:
        return 'claude-instant-1'
      default:
        return 'claude-2'
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return `Claude (API/${this.config.claudeApiModel})`
  }
}
