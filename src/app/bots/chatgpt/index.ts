import { ChatGPTMode, getUserConfig } from '~/services/user-config'
import * as agent from '~services/agent'
import { ChatError, ErrorCode } from '~utils/errors'
import { AsyncAbstractBot, MessageParams } from '../abstract-bot'
import { ChatGPTApiBot } from '../chatgpt-api'
import { ChatGPTAzureApiBot } from '../chatgpt-azure'
import { ChatGPTWebBot } from '../chatgpt-webapp'
import { PoeWebBot } from '../poe'

export class ChatGPTBot extends AsyncAbstractBot {
  async initializeBot() {
    const { chatgptMode, ...config } = await getUserConfig()
    if (chatgptMode === ChatGPTMode.API) {
      if (!config.openaiApiKey) {
        throw new ChatError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET)
      }
      return new ChatGPTApiBot({
        openaiApiKey: config.openaiApiKey,
        openaiApiHost: config.openaiApiHost,
        chatgptApiModel: config.chatgptApiModel,
        chatgptApiTemperature: config.chatgptApiTemperature,
        chatgptApiSystemMessage: config.chatgptApiSystemMessage,
      })
    }
    if (chatgptMode === ChatGPTMode.Azure) {
      if (!config.azureOpenAIApiInstanceName || !config.azureOpenAIApiDeploymentName || !config.azureOpenAIApiKey) {
        throw new Error('Please check your Azure OpenAI API configuration')
      }
      return new ChatGPTAzureApiBot({
        azureOpenAIApiKey: config.azureOpenAIApiKey,
        azureOpenAIApiDeploymentName: config.azureOpenAIApiDeploymentName,
        azureOpenAIApiInstanceName: config.azureOpenAIApiInstanceName,
      })
    }
    if (chatgptMode === ChatGPTMode.Poe) {
      return new PoeWebBot(config.chatgptPoeModelName)
    }
    return new ChatGPTWebBot(config.chatgptWebappModelName)
  }

  async sendMessage(params: MessageParams) {
    const { chatgptWebAccess } = await getUserConfig()
    if (chatgptWebAccess) {
      return agent.execute(params.prompt, (prompt) => this.doSendMessageGenerator({ ...params, prompt }), params.signal)
    }
    return this.doSendMessageGenerator(params)
  }
}
