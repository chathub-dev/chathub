import Browser from 'webextension-polyfill'

export async function requestHostPermission(host: string) {
  return Browser.permissions.request({ origins: [host] })
}
