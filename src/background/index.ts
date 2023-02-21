import Browser from 'webextension-polyfill'

function openAppPage() {
  Browser.tabs.create({ url: 'app.html' })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openAppPage()
  }
})
