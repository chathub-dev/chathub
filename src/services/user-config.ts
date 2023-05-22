import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { ALL_IN_ONE_PAGE_ID, CHATGPT_API_MODELS } from '~app/consts'

export enum BingConversationStyle {
  Creative = 'creative',
  Balanced = 'balanced',
  Precise = 'precise',
}

export enum ChatGPTMode {
  Webapp = 'webapp',
  API = 'api',
  Azure = 'azure',
  Poe = 'poe',
}

export enum ChatGPTWebModels {
  'GPT-3.5' = 'gpt-3.5',
  'GPT-3.5 (Mobile)' = 'gpt-3.5-mobile',
  'GPT-4' = 'gpt-4',
  'GPT-4 (Mobile)' = 'gpt-4-mobile',
  'GPT-4 Browsing' = 'gpt-4-browsing',
}

export enum MultiPanelLayout {
  Two = '2',
  Three = '3',
  Four = '4',
}

export enum PoeGPTModel {
  'GPT-3.5' = 'chinchilla',
  'GPT-4' = 'beaver',
}

export enum PoeClaudeModel {
  ClaudeInstant = 'a2',
  ClaudePlus = 'a2_2',
  ClaudeInstant100k = 'a2_100k',
}

const userConfigWithDefaultValue = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  chatgptApiModel: CHATGPT_API_MODELS[0],
  chatgptApiTemperature: 1,
  chatgptMode: ChatGPTMode.Webapp,
  chatgptWebappModelName: ChatGPTWebModels['GPT-3.5'],
  chatgptPoeModelName: PoeGPTModel['GPT-3.5'],
  startupPage: ALL_IN_ONE_PAGE_ID,
  bingConversationStyle: BingConversationStyle.Balanced,
  multiPanelLayout: MultiPanelLayout.Two,
  poeModel: PoeClaudeModel.ClaudePlus,
  azureOpenAIApiKey: '',
  azureOpenAIApiInstanceName: '',
  azureOpenAIApiDeploymentName: '',
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.sync.get(Object.keys(userConfigWithDefaultValue))
  if (!result.chatgptMode && result.openaiApiKey) {
    result.chatgptMode = ChatGPTMode.API
  }
  if (result.chatgptWebappModelName === 'default') {
    result.chatgptWebappModelName = ChatGPTWebModels['GPT-3.5']
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
