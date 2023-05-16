import { ChatGPTMode, UserConfig, getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { CHATGPT_SYSTEM_MESSAGE, ChatMessage } from './consts'
import { updateTokenUsage } from './usage'

interface ConversationContext {
  messages: ChatMessage[]
}

const SYSTEM_MESSAGE: ChatMessage = { role: 'system', content: CHATGPT_SYSTEM_MESSAGE }
const CONTEXT_SIZE = 10

export class ChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  buildMessages(): ChatMessage[] {
    return [SYSTEM_MESSAGE, ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1))]
  }

  async fetchAzureCompletionApi(userConfig: UserConfig, signal?: AbortSignal) {
    const { azureOpenAIApiInstanceName, azureOpenAIApiDeploymentName, azureOpenAIApiKey } = userConfig
    if (!azureOpenAIApiInstanceName || !azureOpenAIApiDeploymentName || !azureOpenAIApiKey) {
      throw new Error('Please check your Azure OpenAI API configuration')
    }
    const endpoint = `https://${azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${azureOpenAIApiDeploymentName}/chat/completions?api-version=2023-03-15-preview`
    return fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIApiKey,
      },
      body: JSON.stringify({
        messages: this.buildMessages(),
        stream: true,
      }),
    })
  }

  async fetchCompletionApi(signal?: AbortSignal) {
    const userConfig = await getUserConfig()
    if (userConfig.chatgptMode === ChatGPTMode.Azure) {
      return this.fetchAzureCompletionApi(userConfig, signal)
    }
    const { openaiApiKey, openaiApiHost, chatgptApiModel, chatgptApiTemperature } = userConfig
    if (!openaiApiKey) {
      throw new ChatError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET)
    }
    return fetch(`${openaiApiHost}/v1/chat/completions`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: chatgptApiModel,
        messages: this.buildMessages(),
        temperature: chatgptApiTemperature,
        stream: true,
      }),
    })
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }
    this.conversationContext.messages.push({ role: 'user', content: params.prompt })

    const resp = await this.fetchCompletionApi(params.signal)

    let done = false
    const result: ChatMessage = { role: 'assistant', content: '' }

    const finish = () => {
      done = true
      params.onEvent({ type: 'DONE' })
      const messages = this.conversationContext!.messages
      messages.push(result)
      updateTokenUsage(messages).catch(console.error)
    }

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
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

  resetConversation() {
    this.conversationContext = undefined
  }
}
