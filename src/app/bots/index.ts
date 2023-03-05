import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ChatGPTApiBot } from './chatgpt-api'

export type BotId = 'chatgpt' | 'bing'

export const botClasses: Record<BotId, typeof ChatGPTApiBot | typeof BingWebBot> = {
  chatgpt: ChatGPTBot,
  bing: BingWebBot,
}
