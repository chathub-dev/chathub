import { zip } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { BotId } from '~app/bots'
import { ChatMessageModel } from '~types'

/**
 * conversations:$botId => Conversation[]
 * conversation:$botId:$cid:messages => ChatMessageModel[]
 */

interface Conversation {
  id: string
  createdAt: number
}

type ConversationWithMessages = Conversation & { messages: ChatMessageModel[] }

async function loadHistoryConversations(botId: BotId): Promise<Conversation[]> {
  const key = `conversations:${botId}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

async function deleteHistoryConversation(botId: BotId, cid: string) {
  const conversations = await loadHistoryConversations(botId)
  const newConversations = conversations.filter((c) => c.id !== cid)
  await Browser.storage.local.set({ [`conversations:${botId}`]: newConversations })
}

async function loadConversationMessages(botId: BotId, cid: string): Promise<ChatMessageModel[]> {
  const key = `conversation:${botId}:${cid}:messages`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

export async function setConversationMessages(botId: BotId, cid: string, messages: ChatMessageModel[]) {
  const conversations = await loadHistoryConversations(botId)
  if (!conversations.some((c) => c.id === cid)) {
    conversations.unshift({ id: cid, createdAt: Date.now() })
    await Browser.storage.local.set({ [`conversations:${botId}`]: conversations })
  }
  const key = `conversation:${botId}:${cid}:messages`
  await Browser.storage.local.set({ [key]: messages })
}

export async function loadHistoryMessages(botId: BotId): Promise<ConversationWithMessages[]> {
  const conversations = await loadHistoryConversations(botId)
  const messagesList = await Promise.all(conversations.map((c) => loadConversationMessages(botId, c.id)))
  return zip(conversations, messagesList).map(([c, messages]) => ({
    id: c!.id,
    createdAt: c!.createdAt,
    messages: messages!,
  }))
}

export async function deleteHistoryMessage(botId: BotId, conversationId: string, messageId: string) {
  const messages = await loadConversationMessages(botId, conversationId)
  const newMessages = messages.filter((m) => m.id !== messageId)
  await setConversationMessages(botId, conversationId, newMessages)
  if (!newMessages.length) {
    await deleteHistoryConversation(botId, conversationId)
  }
}

export async function clearHistoryMessages(botId: BotId) {
  const conversations = await loadHistoryConversations(botId)
  await Promise.all(
    conversations.map((c) => {
      return Browser.storage.local.remove(`conversation:${botId}:${c.id}:messages`)
    }),
  )
  await Browser.storage.local.remove(`conversations:${botId}`)
}
