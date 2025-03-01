import claudeLogo from '~/assets/logos/anthropic.png'
import baichuanLogo from '~/assets/logos/baichuan.png'
import bardLogo from '~/assets/logos/bard.svg'
import bingLogo from '~/assets/logos/bing.svg'
import chatglmLogo from '~/assets/logos/chatglm.svg'
import chatgptLogo from '~/assets/logos/chatgpt.svg'
import falconLogo from '~/assets/logos/falcon.jpeg'
import geminiLogo from '~/assets/logos/gemini.svg'
import grokLogo from '~/assets/logos/grok.png'
import llamaLogo from '~/assets/logos/llama.png'
import mistralLogo from '~/assets/logos/mistral.png'
import piLogo from '~/assets/logos/pi.png'
import pplxLogo from '~/assets/logos/pplx.jpg'
import qianwenLogo from '~/assets/logos/qianwen.png'
import vicunaLogo from '~/assets/logos/vicuna.jpg'
import wizardlmLogo from '~/assets/logos/wizardlm.png'
import xunfeiLogo from '~/assets/logos/xunfei.png'
import yiLogo from '~/assets/logos/yi.svg'
import rakuten from '~/assets/logos/rakuten.svg'
import chathubLogo from '~/assets/logos/chathub.svg'
import { BotId } from './bots'
import { getUserConfig } from '~services/user-config'

export let CHATBOTS: Record<BotId, { name: string; avatar: string }> = {
  chatgpt: {
    name: 'ChatGPT',
    avatar: chatgptLogo,
  },
  claude: {
    name: 'Claude',
    avatar: claudeLogo,
  },
  gemini: {
    name: 'Gemini Advanced',
    avatar: geminiLogo,
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
  mistral: {
    name: 'Mixtral',
    avatar: mistralLogo,
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
  'customchat1': {
    name: 'customchat1',
    avatar: chathubLogo,
  },
  'customchat2': {
    name: 'customchat2',
    avatar: chathubLogo,
  },
  'customchat3': {
    name: 'customchat3',
    avatar: chathubLogo,
  },
  'customchat4': {
    name: 'customchat4',
    avatar: chathubLogo,
  },
  'customchat5': {
    name: 'customchat5',
    avatar: chathubLogo,
  },
  'customchat6': {
    name: 'customchat6',
    avatar: chathubLogo,
  },
  'customchat7': {
    name: 'customchat7',
    avatar: chathubLogo,
  },
  'customchat8': {
    name: 'customchat8',
    avatar: chathubLogo,
  },
  'customchat9': {
    name: 'customchat9',
    avatar: chathubLogo,
  },
  'customchat10': {
    name: 'customchat9',
    avatar: chathubLogo,
  },
}



export const CHATBOTS_UPDATED_EVENT = 'chatbotsUpdated'


export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-4o', 'gpt-4o-mini', 'o1-mini','o3-mini', 'o1']
export const ALL_IN_ONE_PAGE_ID = 'all'

export const DEFAULT_SYSTEM_MESSAGE = "Current date: {current_date}. \n\nYou prioritize the needs of the user and respond promptly to their questions and requests. You reply in a polite and approachable tone, maintaining professionalism while incorporating humor. For technical or specialized questions, especially those involving programming code, you strive to provide accurate and reliable information, clearly indicating sources when available. You continuously learn and update your knowledge through interactions with users. \nIf additional information is needed to answer a question, you ask the user for it. Think through your response step-by-step before answering.\n\nAdditionally, ensure that your responses are in the language of the user's prompt, or follow any language specifications provided within the prompt."

export const DEFAULT_CHATGPT_SYSTEM_MESSAGE =
  'You are ChatGPT, a large language model trained by OpenAI. Current date: {current_date}. ' + DEFAULT_SYSTEM_MESSAGE
export const DEFAULT_CLAUDE_SYSTEM_MESSAGE =
  'You are ChatGPT, a large language model trained by Anthropic. Current date: {current_date}' + DEFAULT_SYSTEM_MESSAGE

export type Layout = 2 | 3 | 4 | 'imageInput' | 'twoVertical' | 'twoHorizon' | 'sixGrid' // twoVertical is deprecated
