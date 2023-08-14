import alpacaLogo from '~/assets/alpaca-logo.png'
import claudeLogo from '~/assets/anthropic-logo.png'
import bardLogo from '~/assets/bard-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import chatglmLogo from '~/assets/chatglm-logo.svg'
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import guanacoLogo from '~/assets/guanaco-logo.png'
import llamaLogo from '~/assets/llama-logo.png'
import oasstLogo from '~/assets/oasst-logo.svg'
import piLogo from '~/assets/pi-logo.png'
import rwkvLogo from '~/assets/rwkv-logo.png'
import vicunaLogo from '~/assets/vicuna-logo.jpg'
import wizardlmLogo from '~/assets/wizardlm-logo.png'
import xunfeiLogo from '~/assets/xunfei-logo.png'
import { BotId } from './bots'

export const CHATBOTS: Record<BotId, { name: string; avatar: any }> = {
  chatgpt: {
    name: 'ChatGPT',
    avatar: chatgptLogo,
  },
  bing: {
    name: 'Bing',
    avatar: bingLogo,
  },
  bard: {
    name: 'Bard',
    avatar: bardLogo,
  },
  claude: {
    name: 'Claude',
    avatar: claudeLogo,
  },
  llama: {
    name: 'Llama 2',
    avatar: llamaLogo,
  },
  alpaca: {
    name: 'Alpaca',
    avatar: alpacaLogo,
  },
  vicuna: {
    name: 'Vicuna',
    avatar: vicunaLogo,
  },
  pi: {
    name: 'Pi',
    avatar: piLogo,
  },
  chatglm: {
    name: 'ChatGLM2',
    avatar: chatglmLogo,
  },
  xunfei: {
    name: 'iFlytek Spark',
    avatar: xunfeiLogo,
  },
  oasst: {
    name: 'OpenAssistant',
    avatar: oasstLogo,
  },
  rwkv: {
    name: 'ChatRWKV',
    avatar: rwkvLogo,
  },
  guanaco: {
    name: 'Guanaco',
    avatar: guanacoLogo,
  },
  wizardlm: {
    name: 'WizardLM',
    avatar: wizardlmLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k'] as const
export const ALL_IN_ONE_PAGE_ID = 'all'

export const DEFAULT_CHATGPT_SYSTEM_MESSAGE =
  'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021-09-01. Current date: {current_date}'

export type Layout = 2 | 3 | 4 | 'imageInput' | 'twoVertical'
