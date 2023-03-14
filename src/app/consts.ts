import chatgptLogo from '~/assets/chatgpt-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
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
  'gpt-4': {
    name: 'GPT-4',
    avatar: chatgptLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com/chat'
