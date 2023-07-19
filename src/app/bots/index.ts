import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ClaudeBot } from './claude'
import { LMSYSBot } from './lmsys'
import { PiBot } from './pi'
import { XunfeiBot } from './xunfei'

export type BotId =
  | 'chatgpt'
  | 'bing'
  | 'bard'
  | 'claude'
  | 'xunfei'
  | 'vicuna'
  | 'alpaca'
  | 'chatglm'
  | 'koala'
  | 'dolly'
  | 'llama'
  | 'stablelm'
  | 'oasst'
  | 'rwkv'
  | 'pi'

export function createBotInstance(botId: BotId) {
  switch (botId) {
    case 'chatgpt':
      return new ChatGPTBot()
    case 'bing':
      return new BingWebBot()
    case 'bard':
      return new BardBot()
    case 'claude':
      return new ClaudeBot()
    case 'xunfei':
      return new XunfeiBot()
    case 'vicuna':
      return new LMSYSBot('vicuna-13b')
    case 'alpaca':
      return new LMSYSBot('alpaca-13b')
    case 'chatglm':
      return new LMSYSBot('chatglm-6b')
    case 'koala':
      return new LMSYSBot('koala-13b')
    case 'dolly':
      return new LMSYSBot('dolly-v2-12b')
    case 'llama':
      return new LMSYSBot('llama-2-13b-chat')
    case 'stablelm':
      return new LMSYSBot('stablelm-tuned-alpha-7b')
    case 'oasst':
      return new LMSYSBot('oasst-pythia-12b')
    case 'rwkv':
      return new LMSYSBot('RWKV-4-Raven-14B')
    case 'pi':
      return new PiBot()
  }
}

export type BotInstance = ReturnType<typeof createBotInstance>
