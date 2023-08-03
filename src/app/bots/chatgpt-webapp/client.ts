import { RequestInitSubset } from '~types/messaging'
import { ChatError, ErrorCode } from '~utils/errors'
import { Requester, globalFetchRequester } from './requesters'

class ChatGPTClient {
  requester: Requester

  constructor() {
    this.requester = globalFetchRequester
  }

  async fetch(url: string, options?: RequestInitSubset): Promise<Response> {
    return this.requester.fetch(url, options)
  }

  async getAccessToken(): Promise<string> {
    const resp = await this.fetch('https://chat.openai.com/api/auth/session')
    if (resp.status === 403) {
      throw new ChatError('Please pass Cloudflare check', ErrorCode.CHATGPT_CLOUDFLARE)
    }
    const data = await resp.json().catch(() => ({}))
    if (!data.accessToken) {
      throw new ChatError('Unauthorized', ErrorCode.CHATGPT_UNAUTHORIZED)
    }
    return data.accessToken
  }

  private async requestBackendAPIWithToken(token: string, method: string, path: string, data?: unknown) {
    return this.fetch(`https://chat.openai.com/backend-api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    })
  }

  async getModels(token: string): Promise<{ slug: string; title: string; description: string; max_tokens: number }[]> {
    const resp = await this.requestBackendAPIWithToken(token, 'GET', '/models').then((r) => r.json())
    return resp.models
  }
}

export const chatGPTClient = new ChatGPTClient()
