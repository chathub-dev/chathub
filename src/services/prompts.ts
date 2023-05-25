import Browser, { i18n } from 'webextension-polyfill'
import { ofetch } from 'ofetch'
import i18next from 'i18next'

export interface Prompt {
  id: string
  title: string
  prompt: string
}

export async function loadLocalPrompts() {
  const { prompts: value } = await Browser.storage.local.get('prompts')
  return (value || []) as Prompt[]
}

export async function saveLocalPrompt(prompt: Prompt) {
  const prompts = await loadLocalPrompts()
  let existed = false
  for (const p of prompts) {
    if (p.id === prompt.id) {
      p.title = prompt.title
      p.prompt = prompt.prompt
      existed = true
      break
    }
  }
  if (!existed) {
    prompts.unshift(prompt)
  }
  await Browser.storage.local.set({ prompts })
  return existed
}

export async function removeLocalPrompt(id: string) {
  const prompts = await loadLocalPrompts()
  await Browser.storage.local.set({ prompts: prompts.filter((p) => p.id !== id) })
}

export async function loadRemotePrompts() {
  return ofetch<Prompt[]>('https://chathub.gg/api/community-prompts', {
    params: { language: i18next.language, languages: i18next.languages },
  }).catch((err) => {
    console.error('Failed to load remote prompts', err)
    return []
  })
}
