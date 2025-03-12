import { UserConfig } from '~services/user-config'
import { AbstractChatGPTApiBot } from '../chatgpt-api'
import { ChatMessage } from '../chatgpt-api/types'

export class DeepSeekApiBot extends AbstractChatGPTApiBot {
  constructor(
    private config: Pick<
      UserConfig,
      'deepseekApiKey' | 
      'deepseekApiModel'
    >,
  ) {
    super()
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const endpoint = `https://api.deepseek.com/chat/completions`
    return fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.deepseekApiKey}`,
      },
      body: JSON.stringify({
        messages,
        stream: true,
        model: this.config.deepseekApiModel
      }),
    })
  }

  get name() {
    return `DeepSeek API`
  }
}
