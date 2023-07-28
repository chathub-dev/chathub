import Browser from 'webextension-polyfill'

export async function requestHostPermission(host: string) {
  const permissions: Browser.Permissions.Permissions = { origins: [host] }
  if (await Browser.permissions.contains(permissions)) {
    return true
  }
  return Browser.permissions.request(permissions)
}
