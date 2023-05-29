import { UserConfig } from '~services/user-config'
import { AbstractChatGPTApiBot } from '../chatgpt-api'

export class ChatGPTAzureApiBot extends AbstractChatGPTApiBot {
  constructor(
    private config: Pick<
      UserConfig,
      'azureOpenAIApiKey' | 'azureOpenAIApiDeploymentName' | 'azureOpenAIApiInstanceName'
    >,
  ) {
    super()
  }

  async fetchCompletionApi(signal?: AbortSignal) {
    const endpoint = `https://${this.config.azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${this.config.azureOpenAIApiDeploymentName}/chat/completions?api-version=2023-03-15-preview`
    return fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.config.azureOpenAIApiKey,
      },
      body: JSON.stringify({
        messages: this.buildMessages(),
        stream: true,
      }),
    })
  }

  get name() {
    return `ChatGPT (azure/gpt-3.5})`
  }
}
