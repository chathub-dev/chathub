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
          'f.req': JSON.stringify([null, `[[${JSON.stringify(params.prompt)}],null,${JSON.stringify(contextIds)}]`]),
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
}
