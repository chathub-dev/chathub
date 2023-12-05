import { ofetch } from 'ofetch'
import { RequestInitSubset } from '~types/messaging'
import { ChatError, ErrorCode } from '~utils/errors'
import { Requester, globalFetchRequester, proxyFetchRequester } from './requesters'

class ChatGPTClient {
  requester: Requester

  constructor() {
    this.requester = globalFetchRequester
    proxyFetchRequester.findExistingProxyTab().then((tab) => {
      if (tab) {
        this.switchRequester(proxyFetchRequester)
      }
    })
  }

  switchRequester(newRequester: Requester) {
    console.debug('client switchRequester', newRequester)
    this.requester = newRequester
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
      throw new ChatError('There is no logged-in ChatGPT account in this browser.', ErrorCode.CHATGPT_UNAUTHORIZED)
    }
    return data.accessToken
  }

  private async requestBackendAPIWithToken(token: string, method: 'GET' | 'POST', path: string, data?: unknown) {
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

  async generateChatTitle(token: string, conversationId: string, messageId: string) {
    await this.requestBackendAPIWithToken(token, 'POST', `/conversation/gen_title/${conversationId}`, {
      message_id: messageId,
    })
  }

  async createFileUpload(token: string, file: File): Promise<{ fileId: string; uploadUrl: string }> {
    const resp = await this.requestBackendAPIWithToken(token, 'POST', '/files', {
      file_name: file.name,
      file_size: file.size,
      use_case: 'multimodal',
    })
    const data = await resp.json()
    if (data.status !== 'success') {
      throw new Error('Failed to init ChatGPT file upload')
    }
    return {
      fileId: data.file_id,
      uploadUrl: data.upload_url,
    }
  }

  async completeFileUpload(token: string, fileId: string) {
    await this.requestBackendAPIWithToken(token, 'POST', `/files/${fileId}/uploaded`, {})
  }

  async uploadFile(token: string, file: File) {
    const { fileId, uploadUrl } = await this.createFileUpload(token, file)
    await ofetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-version': '2020-04-08',
        'Content-Type': file.type,
      },
    })
    await this.completeFileUpload(token, fileId)
    return fileId
  }

  // Switch to proxy mode, or refresh the proxy tab
  async fixAuthState() {
    if (this.requester === proxyFetchRequester) {
      await proxyFetchRequester.refreshProxyTab()
    } else {
      await proxyFetchRequester.getProxyTab()
      this.switchRequester(proxyFetchRequester)
    }
  }
}

export const chatGPTClient = new ChatGPTClient()
