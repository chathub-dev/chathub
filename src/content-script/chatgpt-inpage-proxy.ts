import Browser from 'webextension-polyfill'
import { setupProxyExecutor } from '~services/proxy-fetch'

function injectTip() {
  const div = document.createElement('div')
  div.innerText = 'Please keep this tab open, now you can go back to ChatHub'
  div.style.position = 'fixed'
  // put the div at right top of page
  div.style.top = '0'
  div.style.right = '0'
  div.style.zIndex = '50'
  div.style.padding = '10px'
  div.style.margin = '10px'
  div.style.border = '1px solid'
  div.style.color = 'red'
  document.body.appendChild(div)
}

async function main() {
  Browser.runtime.onMessage.addListener(async (message) => {
    if (message === 'url') {
      return location.href
    }
  })
  if ((window as any).__NEXT_DATA__) {
    await Browser.runtime.sendMessage({ event: 'PROXY_TAB_READY' })
    injectTip()
  }
}

setupProxyExecutor()
main().catch(console.error)
