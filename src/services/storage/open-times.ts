import Browser from 'webextension-polyfill'

export async function getAppOpenTimes() {
  const { openTimes = 0 } = await Browser.storage.sync.get('openTimes')
  return openTimes
}

export async function incrAppOpenTimes() {
  const openTimes = await getAppOpenTimes()
  Browser.storage.sync.set({ openTimes: openTimes + 1 })
  return openTimes + 1
}

export async function getPremiumModalOpenTimes() {
  const { premiumModalOpenTimes = 0 } = await Browser.storage.sync.get('premiumModalOpenTimes')
  return premiumModalOpenTimes
}

export async function incrPremiumModalOpenTimes() {
  const openTimes = await getPremiumModalOpenTimes()
  Browser.storage.sync.set({ premiumModalOpenTimes: openTimes + 1 })
  return openTimes + 1
}
