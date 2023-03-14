import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ChatGPTWebBot } from './chatgpt-webapp'

export type BotId = 'chatgpt' | 'bing' | 'gpt-4'

export function createBot(botId: BotId) {
  if (botId === 'chatgpt') {
    return new ChatGPTBot()
  }
  if (botId === 'bing') {
    return new BingWebBot()
  }
  if (botId === 'gpt-4') {
    return new ChatGPTWebBot('gpt-4')
  }
}
