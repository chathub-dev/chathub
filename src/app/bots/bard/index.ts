import { ofetch } from 'ofetch'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { fetchRequestParams, parseBardResponse } from './api'

function generateReqId() {
  return Math.floor(Math.random() * 900000) + 100000
}

interface ConversationContext {
  requestParams: Awaited<ReturnType<typeof fetchRequestParams>>
  contextIds: [string, string, string]
}

export class BardBot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = {
        requestParams: await fetchRequestParams(),
        contextIds: ['', '', ''],
      }
    }
    const { requestParams, contextIds } = this.conversationContext

    let imageUrl: string | undefined
    if (params.image) {
      imageUrl = await this.uploadImage(params.image)
    }

    const payload = [
      null,
      JSON.stringify([
        [params.prompt, 0, null, imageUrl ? [[[imageUrl, 1], params.image!.name]] : []],
        null,
        contextIds,
      ]),
    ]

    const resp = await ofetch(
      'https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate',
      {
        method: 'POST',
        signal: params.signal,
        query: {
          bl: requestParams.blValue,
          _reqid: generateReqId(),
          rt: 'c',
        },
        body: new URLSearchParams({
          at: requestParams.atValue!,
          'f.req': JSON.stringify(payload),
        }),
        parseResponse: (txt) => txt,
      },
    )
    const { text, ids } = parseBardResponse(resp)
    this.conversationContext.contextIds = ids
    params.onEvent({
      type: 'UPDATE_ANSWER',
      data: { text },
    })
    params.onEvent({ type: 'DONE' })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  private async uploadImage(image: File) {
    const headers = {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'push-id': 'feeds/mcudyrk2a4khkz',
      'x-goog-upload-header-content-length': image.size.toString(),
      'x-goog-upload-protocol': 'resumable',
      'x-tenant-id': 'bard-storage',
    }
    const resp = await ofetch.raw('https://content-push.googleapis.com/upload/', {
      method: 'POST',
      headers: {
        ...headers,
        'x-goog-upload-command': 'start',
      },
      body: new URLSearchParams({ [`File name: ${image.name}`]: '' }),
    })
    const uploadUrl = resp.headers.get('x-goog-upload-url')
    console.debug('Bard upload url', uploadUrl)
    if (!uploadUrl) {
      throw new Error('Failed to upload image')
    }
    const uploadResult = await ofetch(uploadUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'x-goog-upload-command': 'upload, finalize',
        'x-goog-upload-offset': '0',
      },
      body: image,
    })
    return uploadResult as string
  }
}
