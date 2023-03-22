import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ChatGPTApiBot } from './chatgpt-api'

export type BotId = 'chatgpt' | 'bing' | 'bard'

const botClasses: Record<BotId, typeof ChatGPTApiBot | typeof BingWebBot | typeof BardBot> = {
  chatgpt: ChatGPTBot,
  bing: BingWebBot,
  bard: BardBot,
}

export function createBotInstance(botId: BotId) {
  return new botClasses[botId]()
}
