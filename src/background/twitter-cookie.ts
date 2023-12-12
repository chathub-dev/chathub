/**
 * How it works: pass message via storage.session
 */

import Browser from 'webextension-polyfill'
import Cookie from 'cookie'

const storageKey = 'twitter-csrf-token'

async function readTwitterCsrfToken({ refresh }: { refresh?: boolean } = {}) {
  if (!refresh) {
    const { [storageKey]: token } = await Browser.storage.session.get(storageKey)
    if (token) {
      return token
    }
  }

  const tab = await Browser.tabs.create({ url: 'https://about.twitter.com/en/404', active: false })

  const results = await Browser.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.cookie,
    injectImmediately: true,
  })

  const cookies = Cookie.parse(results[0].result || '')
  const csrfToken = cookies.ct0 || ''
  await Browser.storage.session.set({ [storageKey]: csrfToken })
  return csrfToken
}

export { readTwitterCsrfToken }
