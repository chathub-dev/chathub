import { FetchError, ofetch } from 'ofetch'
import { uuid } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'

export async function fetchOrganizationId(): Promise<string> {
  let resp: Response
  try {
    resp = await fetch('https://claude.ai/api/organizations', { redirect: 'error', cache: 'no-cache' })
  } catch (err) {
    console.error(err)
    throw new ChatError('Claude webapp not avaiable in your country', ErrorCode.CLAUDE_WEB_UNAVAILABLE)
  }
  if (resp.status === 403) {
    throw new ChatError('There is no logged-in Claude account in this browser.', ErrorCode.CLAUDE_WEB_UNAUTHORIZED)
  }
  const orgs = await resp.json()
  return orgs[0].uuid
}

export async function createConversation(organizationId: string): Promise<string> {
  const id = uuid()
  try {
    await ofetch(`https://claude.ai/api/organizations/${organizationId}/chat_conversations`, {
      method: 'POST',
      body: { name: '', uuid: id },
    })
  } catch (err) {
    if (err instanceof FetchError && err.status === 403) {
      throw new ChatError('There is no logged-in Claude account in this browser.', ErrorCode.CLAUDE_WEB_UNAUTHORIZED)
    }
    throw err
  }
  return id
}

export async function generateChatTitle(organizationId: string, conversationId: string, content: string) {
  await ofetch('https://claude.ai/api/generate_chat_title', {
    method: 'POST',
    body: {
      organization_uuid: organizationId,
      conversation_uuid: conversationId,
      recent_titles: [],
      message_content: content,
    },
  })
}
