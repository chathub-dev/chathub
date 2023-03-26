import { random } from 'lodash-es'
import { FetchError, ofetch } from 'ofetch'
import { uuid } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'
import { ConversationResponse } from './types'

// https://github.com/acheong08/EdgeGPT/blob/master/src/EdgeGPT.py#L32
function randomIP() {
  return `13.${random(104, 107)}.${random(0, 255)}.${random(0, 255)}`
}

const API_ENDPOINT = 'https://www.bing.com/turing/conversation/create'

export async function createConversation(): Promise<ConversationResponse> {
  const headers = {
    'x-ms-client-request-id': uuid(),
    'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
  }

  let resp: ConversationResponse
  try {
    resp = await ofetch(API_ENDPOINT, { headers, redirect: 'error' })
    if (!resp.result) {
      throw new Error('Invalid response')
    }
  } catch (err) {
    console.error('retry bing create', err)
    resp = await ofetch(API_ENDPOINT, {
      headers: { ...headers, 'x-forwarded-for': randomIP() },
      redirect: 'error',
    })
    if (!resp) {
      throw new FetchError(`Failed to fetch (${API_ENDPOINT})`)
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
