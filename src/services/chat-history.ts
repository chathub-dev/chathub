import { zip } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { ChatMessageModel } from '~types'

/**
 * conversations:$index => Conversation[]
 * conversation:$index:$cid:messages => ChatMessageModel[]
 */

interface Conversation {
  id: string
  createdAt: number
}

type ConversationWithMessages = Conversation & { messages: ChatMessageModel[] }

async function loadHistoryConversations(index: number): Promise<Conversation[]> {
  const key = `conversations:${index}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

async function deleteHistoryConversation(index: number, cid: string) {
  const conversations = await loadHistoryConversations(index)
  const newConversations = conversations.filter((c) => c.id !== cid)
  await Browser.storage.local.set({ [`conversations:${index}`]: newConversations })
}

async function loadConversationMessages(index: number, cid: string): Promise<ChatMessageModel[]> {
  const key = `conversation:${index}:${cid}:messages`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

export async function setConversationMessages(index: number, cid: string, messages: ChatMessageModel[]) {
  const conversations = await loadHistoryConversations(index)
  if (!conversations.some((c) => c.id === cid)) {
    conversations.unshift({ id: cid, createdAt: Date.now() })
    await Browser.storage.local.set({ [`conversations:${index}`]: conversations })
  }
  const key = `conversation:${index}:${cid}:messages`
  await Browser.storage.local.set({ [key]: messages })
}

export async function loadHistoryMessages(index: number): Promise<ConversationWithMessages[]> {
  const conversations = await loadHistoryConversations(index)
  const messagesList = await Promise.all(conversations.map((c) => loadConversationMessages(index, c.id)))
  return zip(conversations, messagesList).map(([c, messages]) => ({
    id: c!.id,
    createdAt: c!.createdAt,
    messages: messages!,
  }))
}

export async function deleteHistoryMessage(index: number, conversationId: string, messageId: string) {
  const messages = await loadConversationMessages(index, conversationId)
  const newMessages = messages.filter((m) => m.id !== messageId)
  await setConversationMessages(index, conversationId, newMessages)
  if (!newMessages.length) {
    await deleteHistoryConversation(index, conversationId)
  }
}

export async function clearHistoryMessages(index: number) {
  const conversations = await loadHistoryConversations(index)
  await Promise.all(
    conversations.map((c) => {
      return Browser.storage.local.remove(`conversation:${index}:${c.id}:messages`)
    }),
  )
  await Browser.storage.local.remove(`conversations:${index}`)
}
