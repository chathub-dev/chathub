import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { PoeWebBot } from './poe'
import { XunfeiBot } from './xunfei'

export type BotId = 'chatgpt' | 'bing' | 'bard' | 'claude' | 'xunfei'

export function createBotInstance(botId: BotId) {
  switch (botId) {
    case 'chatgpt':
      return new ChatGPTBot()
    case 'bing':
      return new BingWebBot()
    case 'bard':
      return new BardBot()
    case 'claude':
      return new PoeWebBot()
    case 'xunfei':
      return new XunfeiBot()
  }
}
