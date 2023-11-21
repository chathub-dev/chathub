import Browser from 'webextension-polyfill'

export async function requestHostPermissions(hosts: string[]) {
  const permissions: Browser.Permissions.Permissions = { origins: hosts }
  if (await Browser.permissions.contains(permissions)) {
    return true
  }
  return Browser.permissions.request(permissions)
}

export async function requestHostPermission(host: string) {
  return requestHostPermissions([host])
}
