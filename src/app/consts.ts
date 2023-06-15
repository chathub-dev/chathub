import alpacaLogo from '~/assets/alpaca-logo.png'
import claudeLogo from '~/assets/anthropic-logo.png'
import bardLogo from '~/assets/bard-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import chatglmLogo from '~/assets/chatglm-logo.svg'
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import vicunaLogo from '~/assets/vicuna-logo.jpg'
import xunfeiLogo from '~/assets/xunfei-logo.png'
import koalaLogo from '~/assets/koala-logo.jpg'
import dollyLogo from '~/assets/dolly-logo.png'
import llamaLogo from '~/assets/llama-logo.png'
import stablelmLogo from '~/assets/stablelm-logo.png'
import oasstLogo from '~/assets/oasst-logo.svg'
import rwkvLogo from '~/assets/rwkv-logo.png'
import { BotId } from './bots'
import i18n from './i18n'

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
  xunfei: {
    name: i18n.t('iFlytek Spark'),
    avatar: xunfeiLogo,
  },
  chatglm: {
    name: 'ChatGLM',
    avatar: chatglmLogo,
  },
  alpaca: {
    name: 'Alpaca',
    avatar: alpacaLogo,
  },
  vicuna: {
    name: 'Vicuna',
    avatar: vicunaLogo,
  },
  koala: {
    name: 'Koala',
    avatar: koalaLogo,
  },
  dolly: {
    name: 'Dolly',
    avatar: dollyLogo,
  },
  llama: {
    name: 'LLaMA',
    avatar: llamaLogo,
  },
  stablelm: {
    name: 'StableLM',
    avatar: stablelmLogo,
  },
  oasst: {
    name: 'OpenAssistant',
    avatar: oasstLogo,
  },
  rwkv: {
    name: 'ChatRWKV',
    avatar: rwkvLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k'] as const
export const ALL_IN_ONE_PAGE_ID = 'all'
