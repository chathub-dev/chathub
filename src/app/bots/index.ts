import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ClaudeBot } from './claude'
import { LMSYSBot } from './lmsys'
import { XunfeiBot } from './xunfei'
import { Claude2Bot } from './claude-2'

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
  | 'claude-2'

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
      return new LMSYSBot('llama-13b')
    case 'stablelm':
      return new LMSYSBot('stablelm-tuned-alpha-7b')
    case 'oasst':
      return new LMSYSBot('oasst-pythia-12b')
    case 'rwkv':
      return new LMSYSBot('RWKV-4-Raven-14B')
    case 'claude-2':
      return new Claude2Bot()
  }
}

export type BotInstance = ReturnType<typeof createBotInstance>
