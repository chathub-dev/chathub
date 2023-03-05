import Browser from 'webextension-polyfill'

export async function setApiKey(apiKey: string) {
  await Browser.storage.sync.set({
    'openai-api-key': apiKey,
  })
}

export async function getApiKey(): Promise<string | undefined> {
  const result = await Browser.storage.sync.get('openai-api-key')
  return result['openai-api-key']
}
