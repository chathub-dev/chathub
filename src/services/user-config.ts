import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum StartupPage {
  All = 'all',
  ChatGPT = 'chatgpt',
  Bing = 'bing',
  GPT4 = 'gpt-4',
}

export enum BingConversationStyle {
  Creative = 'creative',
  Balanced = 'balanced',
  Precise = 'precise',
}

const userConfigWithDefaultValue = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  chatgptApiTemperature: 0.6,
  startupPage: StartupPage.All,
  bingConversationStyle: BingConversationStyle.Balanced,
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.sync.get(Object.keys(userConfigWithDefaultValue))
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
