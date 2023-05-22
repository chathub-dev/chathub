import { ChatGPTMode, getUserConfig } from '~/services/user-config'
import { AbstractBot, DummyBot, SendMessageParams } from '../abstract-bot'
import { ChatGPTApiBot } from '../chatgpt-api'
import { ChatGPTWebBot } from '../chatgpt-webapp'
import { PoeWebBot } from '../poe'

export class ChatGPTBot extends AbstractBot {
  #bot: AbstractBot

  constructor() {
    super()
    this.#bot = new DummyBot()
    getUserConfig().then(({ chatgptMode, ...config }) => {
      if (chatgptMode === ChatGPTMode.API || chatgptMode === ChatGPTMode.Azure) {
        this.#bot = new ChatGPTApiBot()
      } else if (chatgptMode === ChatGPTMode.Poe) {
        this.#bot = new PoeWebBot(config.chatgptPoeModelName)
      } else {
        this.#bot = new ChatGPTWebBot()
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
