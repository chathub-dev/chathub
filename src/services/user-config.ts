import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { CHATGPT_API_MODELS } from '~app/consts'

export enum StartupPage {
  All = 'all',
  ChatGPT = 'chatgpt',
  Bing = 'bing',
}

export enum BingConversationStyle {
  Creative = 'creative',
  Balanced = 'balanced',
  Precise = 'precise',
}

export enum ChatGPTMode {
  API = 'api',
  Webapp = 'webapp',
}

export const userConfigWithDefaultValue = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  chatgptApiModel: CHATGPT_API_MODELS[0],
  chatgptMode: ChatGPTMode.Webapp,
  chatgptWebappModelName: 'default',
  startupPage: StartupPage.All,
  bingConversationStyle: BingConversationStyle.Balanced,
  language: 'en',
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.sync.get(Object.keys(userConfigWithDefaultValue))
  if (!result.chatgptMode && result.openaiApiKey) {
    result.chatgptMode = ChatGPTMode.API
  }
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  await Browser.storage.sync.set(updates)
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      await Browser.storage.sync.remove(key)
    }
  }
}
