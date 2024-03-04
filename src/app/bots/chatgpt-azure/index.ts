import { UserConfig } from '~services/user-config'
import { AbstractChatGPTApiBot } from '../chatgpt-api'
import { ChatMessage } from '../chatgpt-api/types'

export class ChatGPTAzureApiBot extends AbstractChatGPTApiBot {
  constructor(
    private config: Pick<
      UserConfig,
      'azureOpenAIApiKey' | 'azureOpenAIApiDeploymentName' | 'azureOpenAIApiInstanceName'
    >,
  ) {
    super()
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const endpoint = `https://${this.config.azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${this.config.azureOpenAIApiDeploymentName}/chat/completions?api-version=2023-12-01-preview`
    return fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.config.azureOpenAIApiKey,
      },
      body: JSON.stringify({
        messages,
        stream: true,
      }),
    })
  }

  get name() {
    return `ChatGPT (azure/gpt-4-1106-preview)`
  }

  getSystemMessage() {
    return `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2023-04. Current date: {current_date}`
  }
}
