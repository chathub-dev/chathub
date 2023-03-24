import { ofetch, FetchError } from 'ofetch'
import { uuid } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'
import { ConversationResponse } from './types'

export async function createConversation(): Promise<ConversationResponse> {
  const headers = {
    'x-forwarded-for': '1.1.1.1',
    'x-ms-client-request-id': uuid(),
    'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
  }

  let resp: ConversationResponse
  try {
    resp = await ofetch('https://www.bing.com/turing/conversation/create', { headers })
    if (!resp.result) {
      console.debug('bing/conversation/create', resp)
      resp = await ofetch('https://edgeservices.bing.com/edgesvc/turing/conversation/create', { headers })
    }
  } catch (err) {
    if (err instanceof FetchError && err.status === 404) {
      resp = await ofetch('https://edgeservices.bing.com/edgesvc/turing/conversation/create', { headers })
    } else {
      throw err
    }
  }

  if (resp.result.value !== 'Success') {
    const message = `${resp.result.value}: ${resp.result.message}`
    if (resp.result.value === 'UnauthorizedRequest') {
      throw new ChatError(message, ErrorCode.BING_UNAUTHORIZED)
    }
    if (resp.result.value === 'Forbidden') {
      throw new ChatError(message, ErrorCode.BING_FORBIDDEN)
    }
    throw new Error(message)
  }
  return resp
}
