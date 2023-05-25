import { getUserConfig } from '~/services/user-config'
import { AbstractBot, DummyBot, SendMessageParams } from '../abstract-bot'
import { PoeWebBot } from '../poe'

export class ClaudeBot extends AbstractBot {
  #bot: AbstractBot

  constructor() {
    super()
    this.#bot = new DummyBot()
    getUserConfig().then(({ poeModel }) => {
      this.#bot = new PoeWebBot(poeModel)
    })
  }

  doSendMessage(params: SendMessageParams) {
    return this.#bot.doSendMessage(params)
  }

  resetConversation() {
    return this.#bot.resetConversation()
  }
}
