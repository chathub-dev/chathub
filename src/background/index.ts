import Browser from 'webextension-polyfill'

Browser.action.onClicked.addListener(() => {
  Browser.tabs.create({
    url: 'app.html',
  })
})
