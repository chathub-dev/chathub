import alpacaLogo from '~/assets/alpaca-logo.png'
import claudeLogo from '~/assets/anthropic-logo.png'
import bardLogo from '~/assets/bard-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import chatglmLogo from '~/assets/chatglm-logo.svg'
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import vicunaLogo from '~/assets/vicuna-logo.jpg'
import xunfeiLogo from '~/assets/xunfei-logo.png'
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
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k']
export const ALL_IN_ONE_PAGE_ID = 'all'
