import { BaichuanWebBot } from './baichuan'
import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ClaudeBot } from './claude'
import { LMSYSBot } from './lmsys'
import { PiBot } from './pi'
import { QianwenWebBot } from './qianwen'
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
  | 'llama'
  | 'oasst'
  | 'rwkv'
  | 'pi'
  | 'guanaco'
  | 'wizardlm'
  | 'qianwen'
  | 'baichuan'

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
      return new LMSYSBot('vicuna-33b')
    case 'alpaca':
      return new LMSYSBot('alpaca-13b')
    case 'chatglm':
      return new LMSYSBot('chatglm2-6b')
    case 'llama':
      return new LMSYSBot('llama-2-70b-chat')
    case 'oasst':
      return new LMSYSBot('oasst-pythia-12b')
    case 'rwkv':
      return new LMSYSBot('RWKV-4-Raven-14B')
    case 'guanaco':
      return new LMSYSBot('guanaco-33b')
    case 'wizardlm':
      return new LMSYSBot('wizardlm-13b')
    case 'pi':
      return new PiBot()
    case 'qianwen':
      return new QianwenWebBot()
    case 'baichuan':
      return new BaichuanWebBot()
  }
}

export type BotInstance = ReturnType<typeof createBotInstance>
