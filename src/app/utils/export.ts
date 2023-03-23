import { fileOpen, fileSave } from 'browser-fs-access'
import Browser from 'webextension-polyfill'
import { trackEvent } from '~app/plausible'

export async function exportData() {
  const [syncData, localData] = await Promise.all([Browser.storage.sync.get(null), Browser.storage.local.get(null)])
  const data = { sync: syncData, local: localData }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  await fileSave(blob, { fileName: 'chathub.json' })
  trackEvent('export_data')
}

export async function importData() {
  const blob = await fileOpen({ extensions: ['.json'] })
  const json = JSON.parse(await blob.text())
  if (!json.sync || !json.local) {
    throw new Error('Invalid data')
  }
  if (!window.confirm('Are you sure you want to import data? This will overwrite your current data')) {
    return
  }
  await Browser.storage.local.clear()
  await Browser.storage.local.set(json.local)
  await Browser.storage.sync.clear()
  await Browser.storage.sync.set(json.sync)
  alert('Imported data successfully')
  trackEvent('import_data')
  location.reload()
}
