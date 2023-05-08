import chatgptLogo from '~/assets/chatgpt-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import bardLogo from '~/assets/bard-logo.svg'
import claudeLogo from '~/assets/anthropic-logo.png'
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
  xunfei: {
    name: '讯飞星火',
    avatar: xunfeiLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'

export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k']
