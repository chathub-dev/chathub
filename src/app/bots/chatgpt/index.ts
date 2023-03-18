import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { ChatGPTMode, getUserConfig } from '~/services/user-config'
import { ChatGPTApiBot } from '../chatgpt-api'
import { ChatGPTWebBot } from '../chatgpt-webapp'

export class ChatGPTBot extends AbstractBot {
  #bot: ChatGPTApiBot | ChatGPTWebBot

  constructor() {
    super()
    this.#bot = new ChatGPTWebBot()
    getUserConfig().then(({ chatgptMode, chatgptWebappModelName }) => {
      if (chatgptMode === ChatGPTMode.API) {
        this.#bot = new ChatGPTApiBot()
      } else {
        this.#bot = new ChatGPTWebBot(chatgptWebappModelName === 'default' ? undefined : chatgptWebappModelName)
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
