import { ChatError, ErrorCode } from '~utils/errors'

export async function getChatGPTAccessToken(): Promise<string> {
  const resp = await fetch('https://chat.openai.com/api/auth/session')
  if (resp.status === 403) {
    throw new ChatError('Please pass Cloudflare check', ErrorCode.CLOUDFLARE)
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    throw new ChatError('UNAUTHORIZED', ErrorCode.CHATGPT_UNAUTHORIZED)
  }
  return data.accessToken
}

export async function requestBackendAPIWithToken(token: string, method: string, path: string, data?: unknown) {
  return fetch(`https://chat.openai.com/backend-api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}
