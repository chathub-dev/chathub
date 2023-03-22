import Browser from 'webextension-polyfill'
import { ofetch } from 'ofetch'

export interface Prompt {
  id: string
  title: string
  prompt: string
}

export async function loadLocalPrompts() {
  const { prompts: value } = await Browser.storage.local.get('prompts')
  return (value || []) as Prompt[]
}

export async function addLocalPrompt(prompt: Prompt) {
  const prompts = await loadLocalPrompts()
  await Browser.storage.local.set({ prompts: [prompt, ...prompts] })
}

export async function editLocalPrompt(prompt: Prompt) {
  const prompts = await loadLocalPrompts()
  await Browser.storage.local.set({ prompts: prompts.map((p) => (p.id === prompt.id ? prompt : p))})
}

export async function removeLocalPrompt(id: string) {
  const prompts = await loadLocalPrompts()
  await Browser.storage.local.set({ prompts: prompts.filter((p) => p.id !== id) })
}

export async function loadRemotePrompts() {
  return ofetch<Prompt[]>('https://chathub.gg/api/community-prompts').catch((err) => {
    console.error('Failed to load remote prompts', err)
    return []
  })
}
