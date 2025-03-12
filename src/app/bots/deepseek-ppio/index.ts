import { UserConfig } from '~services/user-config'
import { AbstractChatGPTApiBot } from '../chatgpt-api'
import { ChatMessage } from '../chatgpt-api/types'

export class DeepSeekPpioBot extends AbstractChatGPTApiBot {
  constructor(
    private config: Pick<
      UserConfig,
      'deepseekPpioKey' | 
      'deepseekPpioModel'
    >,
  ) {
    super()
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const endpoint = `https://api.ppinfra.com/v3/openai/chat/completions`
    return fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.deepseekPpioKey}`,
      },
      body: JSON.stringify({
        messages,
        stream: true,
        model: this.config.deepseekPpioModel
      }),
    })
  }

  get name() {
    return `DeepSeek PPIO API`
  }
}
