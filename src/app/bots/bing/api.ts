import { ofetch } from 'ofetch'
import { uuid } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'
import { ConversationResponse } from './types'

export async function createConversation(): Promise<ConversationResponse> {
  const resp = await ofetch<ConversationResponse>('https://www.bing.com/turing/conversation/create', {
    headers: {
      'x-ms-client-request-id': uuid(),
      'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
    },
  })
  if (resp.result.value !== 'Success') {
    const message = `${resp.result.value}: ${resp.result.message}`
    if (resp.result.value === 'UnauthorizedRequest') {
      throw new ChatError(message, ErrorCode.BING_UNAUTHORIZED)
    }
    throw new Error(message)
  }
  return resp
}
