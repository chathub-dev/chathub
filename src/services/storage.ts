import Browser from 'webextension-polyfill'

export async function getTokenUsage() {
  const { tokenUsage } = await Browser.storage.sync.get('tokenUsage')
  return tokenUsage || 0
}

export async function incrTokenUsage(v = 1) {
  const tokenUsage = await getTokenUsage()
  await Browser.storage.sync.set({ tokenUsage: tokenUsage + v })
}

export async function resetTokenUsage() {
  await Browser.storage.sync.remove('tokenUsage')
}
