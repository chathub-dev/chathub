import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { getUserConfig } from '~/services/user-config'
import { ChatGPTApiBot } from '../chatgpt-api'
import { ChatGPTWebBot } from '../chatgpt-webapp'

export class ChatGPTBot extends AbstractBot {
  #bot: ChatGPTApiBot | ChatGPTWebBot

  constructor() {
    super()
    this.#bot = new ChatGPTWebBot()
    getUserConfig().then(({ openaiApiKey }) => {
      if (openaiApiKey) {
        this.#bot = new ChatGPTApiBot()
      }
    })
  }

  doSendMessage(params: SendMessageParams): Promise<void> {
    return this.#bot.doSendMessage(params)
  }

  resetConversation(): void {
    return this.#bot.resetConversation()
  }
}
