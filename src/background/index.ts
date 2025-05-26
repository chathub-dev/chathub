import Browser from 'webextension-polyfill'
import { ALL_IN_ONE_PAGE_ID } from '~app/consts'
import { getUserConfig } from '~services/user-config'
import { readTwitterCsrfToken } from './twitter-cookie'

// expose storage.session to content scripts
// using `chrome.*` API because `setAccessLevel` is not supported by `Browser.*` API
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

async function openAppPage() {
  const tabs = await Browser.tabs.query({})
  const url = Browser.runtime.getURL('app.html')
  const tab = tabs.find((tab) => tab.url?.startsWith(url))
  if (tab) {
    await Browser.tabs.update(tab.id, { active: true })
    return
  }
  const { startupPage } = await getUserConfig()
  const hash = startupPage === ALL_IN_ONE_PAGE_ID ? '' : `#/chat/${startupPage}`
  await Browser.tabs.create({ url: `app.html${hash}` })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.tabs.create({ url: 'app.html#/setting' })
  }
})

Browser.commands.onCommand.addListener(async (command) => {
  console.debug(`Command: ${command}`)
  if (command === 'open-app') {
    openAppPage()
  }
})

Browser.runtime.onMessage.addListener(async (message, sender) => {
  console.debug('onMessage', message, sender)
  if (message.target !== 'background') {
    return
  }
  if (message.type === 'read-twitter-csrf-token') {
    return readTwitterCsrfToken(message.data)
  }
})

// Omnibox APIのイベントリスナー
chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  console.log('[background] Omnibox input entered:', text, 'Disposition:', disposition)
  // 検索キーワードをchrome.storage.localに保存
  await Browser.storage.local.set({ pendingOmniboxSearch: text })

  const appUrl = Browser.runtime.getURL('app.html')

  if (disposition === 'currentTab') {
    // 現在アクティブなタブを取得して更新
    const [currentTab] = await Browser.tabs.query({ active: true, currentWindow: true })
    if (currentTab && currentTab.id) {
      await Browser.tabs.update(currentTab.id, { url: appUrl })
    } else {
      // アクティブなタブが見つからない場合は新しいタブで開く（フォールバック）
      await Browser.tabs.create({ url: appUrl })
    }
  } else {
    // 新しいフォアグラウンドタブ、または新しいバックグラウンドタブで開く場合
    // (またはその他の disposition の場合も新しいタブで開く)
    await Browser.tabs.create({ url: appUrl, active: (disposition === 'newForegroundTab') })
  }
})
