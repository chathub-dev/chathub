import Browser from 'webextension-polyfill'
import { CLAUDE_2_HOME_URL } from '~app/consts'
import { proxyFetch } from '~services/proxy-fetch'
import { RequestInitSubset } from '~types/messaging'

export interface Requester {
  fetch(url: string, options?: RequestInitSubset): Promise<Response>
}

class GlobalFetchRequester implements Requester {
  fetch(url: string, options?: RequestInitSubset) {
    return fetch(url, options)
  }
}

class ProxyFetchRequester implements Requester {
  async findExistingProxyTab() {
    const tabs = await Browser.tabs.query({ pinned: true })
    const results: (string | undefined)[] = await Promise.all(
      tabs.map(async (tab) => {
        if (tab.url) {
          return tab.url
        }
        return Browser.tabs.sendMessage(tab.id!, 'url').catch(() => undefined)
      }),
    )
    for (let i = 0; i < results.length; i++) {
      if (results[i]?.startsWith('https://claude.ai')) {
        return tabs[i]
      }
    }
  }

  waitForProxyTabReady(onReady: (tab: Browser.Tabs.Tab) => void) {
    Browser.runtime.onMessage.addListener(async function listener(message, sender) {
      if (message.event === 'PROXY_TAB_READY') {
        console.debug('new proxy tab ready')
        Browser.runtime.onMessage.removeListener(listener)
        onReady(sender.tab!)
      }
    })
  }

  async createProxyTab() {
    return new Promise<Browser.Tabs.Tab>((resolve) => {
      this.waitForProxyTabReady(resolve)
      Browser.tabs.create({ url: CLAUDE_2_HOME_URL, pinned: true })
    })
  }

  async getProxyTab() {
    let tab = await this.findExistingProxyTab()
    if (!tab) {
      tab = await this.createProxyTab()
    }
    return tab
  }

  async refreshProxyTab() {
    const tab = await this.findExistingProxyTab()
    if (!tab) {
      await this.createProxyTab()
      return
    }
    return new Promise<Browser.Tabs.Tab>((resolve) => {
      this.waitForProxyTabReady(resolve)
      Browser.tabs.reload(tab.id!)
    })
  }

  async fetch(url: string, options?: RequestInitSubset) {
    const tab = await this.getProxyTab()
    const resp = await proxyFetch(tab.id!, url, options)
    if (resp.status === 403) {
      await this.refreshProxyTab()
      return proxyFetch(tab.id!, url, options)
    }
    return resp
  }
}

export const globalFetchRequester = new GlobalFetchRequester()
export const proxyFetchRequester = new ProxyFetchRequester()
