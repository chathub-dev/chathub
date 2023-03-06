import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum StartupPage {
  All = 'all',
  ChatGPT = 'chatgpt',
  Bing = 'bing',
}

const userConfigWithDefaultValue = {
  openaiApiKey: '',
  startupPage: StartupPage.All,
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  return Browser.storage.local.set(updates)
}
