import Browser from 'webextension-polyfill'
import { CHATGPT_HOME_URL } from '~app/consts'
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
    return tabs.find((tab) => tab.url?.startsWith('https://chat.openai.com'))
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
      Browser.tabs.create({ url: CHATGPT_HOME_URL, pinned: true })
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
    await Browser.tabs.update(tab.id!, { active: true })
    return new Promise<Browser.Tabs.Tab>((resolve) => {
      this.waitForProxyTabReady(resolve)
      Browser.tabs.reload(tab.id!)
    })
  }

  async fetch(url: string, options?: RequestInitSubset) {
    const tab = await this.getProxyTab()
    return proxyFetch(tab.id!, url, options)
  }
}

export const globalFetchRequester = new GlobalFetchRequester()
export const proxyFetchRequester = new ProxyFetchRequester()
