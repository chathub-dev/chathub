import i18next from 'i18next'
import { ofetch } from 'ofetch'
import Browser from 'webextension-polyfill'

export interface Magisk {
  id: string
  title: string
  magisk: string
}

export async function loadLocalMagiskList() {
  const { magiskList: value } = await Browser.storage.local.get('magiskList')
  return (value || []) as Magisk[]
}

export function loadUsedMagisk() {
  const value = localStorage.getItem("use_magisk");
  let magisk = {id: '', title: '', magisk: ''}
  if(value) {
    magisk = JSON.parse(value)
  }
  return (magisk) as Magisk
}

export async function saveLocalMagisk(magisk: Magisk) {
  const magiskList = await loadLocalMagiskList()
  let existed = false
  for (const p of magiskList) {
    if (p.id === magisk.id) {
      p.title = magisk.title
      p.magisk = magisk.magisk
      existed = true
      break
    }
  }
  if (!existed) {
    magiskList.unshift(magisk)
  }
  await Browser.storage.local.set({ magiskList })
  return existed
}

export function useMagisk(magisk: Magisk) {
  localStorage.setItem("use_magisk", JSON.stringify(magisk))
  return magisk
}

export async function removeLocalMagisk(id: string) {
  const magiskList = await loadLocalMagiskList()
  await Browser.storage.local.set({ magiskList: magiskList.filter((p) => p.id !== id) })
}

export async function loadRemoteMagiskList() {
  return ofetch<Magisk[]>('https://chathub.gg/api/community-magiskList', {
    params: { language: i18next.language, languages: i18next.languages },
  }).catch((err) => {
    console.error('Failed to load remote magiskList', err)
    return []
  })
}
