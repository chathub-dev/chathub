import { ofetch } from 'ofetch'
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
    throw new ChatError('UNAUTHORIZED', ErrorCode.CLAUDE_WEB_UNAUTHORIZED)
  }
  const orgs = await resp.json()
  return orgs[0].uuid
}

export async function createConversation(organizationId: string): Promise<string> {
  const id = uuid()
  await ofetch(`https://claude.ai/api/organizations/${organizationId}/chat_conversations`, {
    method: 'POST',
    body: { name: '', uuid: id },
  })
  return id
}
