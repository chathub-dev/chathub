import claudeLogo from '~/assets/anthropic-logo.png'
import baichuanLogo from '~/assets/baichuan-logo.png'
import bardLogo from '~/assets/bard-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import chatglmLogo from '~/assets/chatglm-logo.svg'
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import falconLogo from '~/assets/falcon-logo.jpeg'
import llamaLogo from '~/assets/llama-logo.png'
import mistralLogo from '~/assets/mistral-logo.png'
import piLogo from '~/assets/pi-logo.png'
import qianwenLogo from '~/assets/qianwen-logo.png'
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
  vicuna: {
    name: 'Vicuna',
    avatar: vicunaLogo,
  },
  falcon: {
    name: 'Falcon',
    avatar: falconLogo,
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
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k', 'gpt-4-turbo'] as const
export const ALL_IN_ONE_PAGE_ID = 'all'

export const DEFAULT_CHATGPT_SYSTEM_MESSAGE =
  'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021-09-01. Current date: {current_date}'

export type Layout = 2 | 3 | 4 | 'imageInput' | 'twoVertical' | 'sixGrid' // twoVertical is deprecated
