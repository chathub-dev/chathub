import claudeLogo from '~/assets/anthropic-logo.png'
import baichuanLogo from '~/assets/baichuan-logo.png'
import bardLogo from '~/assets/bard-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import chatglmLogo from '~/assets/chatglm-logo.svg'
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import falconLogo from '~/assets/falcon-logo.jpeg'
import grokLogo from '~/assets/grok-logo.png'
import llamaLogo from '~/assets/llama-logo.png'
import mistralLogo from '~/assets/mistral-logo.png'
import piLogo from '~/assets/pi-logo.png'
import pplxLogo from '~/assets/pplx-logo.jpg'
import qianwenLogo from '~/assets/qianwen-logo.png'
import vicunaLogo from '~/assets/vicuna-logo.jpg'
import wizardlmLogo from '~/assets/wizardlm-logo.png'
import xunfeiLogo from '~/assets/xunfei-logo.png'
import yiLogo from '~/assets/yi-logo.svg'
import { BaichuanWebBot } from './baichuan'
import { BardBot } from './bard'
import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ClaudeBot } from './claude'
import { GrokWebBot } from './grok'
import { LMSYSBot } from './lmsys'
import { PerplexityBot } from './perplexity'
import { PiBot } from './pi'
import { QianwenWebBot } from './qianwen'
import { XunfeiBot } from './xunfei'

export type BotId =
  | 'chatgpt'
  | 'bing'
  | 'bard'
  | 'claude'
  | 'perplexity'
  | 'xunfei'
  | 'vicuna'
  | 'falcon'
  | 'mistral'
  | 'chatglm'
  | 'llama'
  | 'pi'
  | 'wizardlm'
  | 'qianwen'
  | 'baichuan'
  | 'yi'
  | 'grok'

export const CHATBOTS: Record<BotId, { name: string; avatar: string }> = {
  chatgpt: {
    name: 'ChatGPT',
    avatar: chatgptLogo,
  },
  claude: {
    name: 'Claude',
    avatar: claudeLogo,
  },
  bard: {
    name: 'Bard',
    avatar: bardLogo,
  },
  bing: {
    name: 'Bing',
    avatar: bingLogo,
  },
  perplexity: {
    name: 'Perplexity',
    avatar: pplxLogo,
  },
  llama: {
    name: 'Llama 2',
    avatar: llamaLogo,
  },
  vicuna: {
    name: 'Vicuna',
    avatar: vicunaLogo,
  },
  falcon: {
    name: 'Falcon',
    avatar: falconLogo,
  },
  grok: {
    name: 'Grok',
    avatar: grokLogo,
  },
  mistral: {
    name: 'Mistral',
    avatar: mistralLogo,
  },
  pi: {
    name: 'Pi',
    avatar: piLogo,
  },
  wizardlm: {
    name: 'WizardLM',
    avatar: wizardlmLogo,
  },
  chatglm: {
    name: 'ChatGLM2',
    avatar: chatglmLogo,
  },
  xunfei: {
    name: 'iFlytek Spark',
    avatar: xunfeiLogo,
  },
  qianwen: {
    name: 'Qianwen',
    avatar: qianwenLogo,
  },
  baichuan: {
    name: 'Baichuan',
    avatar: baichuanLogo,
  },
  yi: {
    name: 'Yi-Chat',
    avatar: yiLogo,
  },
}

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
    case 'chatglm':
      return new LMSYSBot('chatglm2-6b')
    case 'llama':
      return new LMSYSBot('llama-2-70b-chat')
    case 'wizardlm':
      return new LMSYSBot('wizardlm-13b')
    case 'falcon':
      return new LMSYSBot('falcon-180b-chat')
    case 'mistral':
      return new LMSYSBot('mistral-7b-instruct')
    case 'yi':
      return new LMSYSBot('yi-34b-chat')
    case 'pi':
      return new PiBot()
    case 'qianwen':
      return new QianwenWebBot()
    case 'baichuan':
      return new BaichuanWebBot()
    case 'perplexity':
      return new PerplexityBot()
    case 'grok':
      return new GrokWebBot()
  }
}

export type BotInstance = ReturnType<typeof createBotInstance>
