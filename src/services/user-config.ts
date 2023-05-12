import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { ALL_IN_ONE_PAGE_ID, CHATGPT_API_MODELS } from '~app/consts'

export enum BingConversationStyle {
  Creative = 'creative',
  Balanced = 'balanced',
  Precise = 'precise',
}

export enum ChatGPTMode {
  API = 'api',
  Webapp = 'webapp',
}

export enum MultiPanelLayout {
  Two = '2',
  Three = '3',
  Four = '4',
}

const userConfigWithDefaultValue = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  chatgptApiModel: CHATGPT_API_MODELS[0],
  chatgptApiTemperature: 1,
  chatgptMode: ChatGPTMode.Webapp,
  chatgptWebappModelName: 'default',
  startupPage: ALL_IN_ONE_PAGE_ID,
  bingConversationStyle: BingConversationStyle.Balanced,
  multiPanelLayout: MultiPanelLayout.Two,
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
