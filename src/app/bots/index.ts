import { AbstractBot } from './abstract-bot'
import { BingWebBot } from './bing'
import { ChatGPTWebBot } from './chatgpt-webapp'

export type BotId = 'chatgpt' | 'bing'

export const botClasses: Record<BotId, typeof ChatGPTWebBot | typeof BingWebBot> = {
  chatgpt: ChatGPTWebBot,
  bing: BingWebBot,
}
