/**
 * How it works: pass message via storage.session
 */

import Browser from 'webextension-polyfill'

const storageKey = 'twitter-csrf-token'

async function readTwitterCsrfToken({ refresh }: { refresh?: boolean } = {}) {
  if (!refresh) {
    const { [storageKey]: token } = await Browser.storage.session.get(storageKey)
    if (token) {
      return token
    }
  }

  return new Promise((resolve, reject) => {
    let tabId: number | undefined

    const listener = (changes: Browser.Storage.StorageAreaOnChangedChangesType) => {
      console.debug('storage.session changes', changes)
      if (changes[storageKey] && 'newValue' in changes[storageKey]) {
        clearTimeout(timer)
        Browser.storage.session.onChanged.removeListener(listener)
        resolve(changes[storageKey].newValue)
        if (tabId) {
          Browser.tabs.remove(tabId)
          tabId = undefined
        }
      }
    }
    Browser.storage.session.onChanged.addListener(listener)

    const timer = setTimeout(() => {
      Browser.storage.session.onChanged.removeListener(listener)
      reject('Twitter CSRF timeout')
    }, 10 * 1000)

    Browser.tabs.create({ url: 'https://twitter.com/', active: false }).then((tab) => {
      tabId = tab.id
    })
  })
}

export { readTwitterCsrfToken }
