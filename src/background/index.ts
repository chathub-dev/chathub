import Browser from 'webextension-polyfill'
import { getUserConfig, StartupPage } from '~services/user-config'

async function openAppPage() {
  const { startupPage } = await getUserConfig()
  const hash = startupPage === StartupPage.All ? '' : `#/chat/${startupPage}`
  await Browser.tabs.create({ url: `app.html${hash}` })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openAppPage()
  }
})

Browser.commands.onCommand.addListener((command) => {
  console.debug(`Command: ${command}`)
  if (command === 'open-app') {
    openAppPage()
  }
})
