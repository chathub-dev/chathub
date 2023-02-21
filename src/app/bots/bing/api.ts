import wretch from 'wretch'
import { uuid } from '~utils'
import { ConversationResponse } from './types'

export async function createConversation(): Promise<ConversationResponse> {
  const resp: ConversationResponse = await wretch('https://www.bing.com/turing/conversation/create')
    .headers({
      'x-ms-client-request-id': uuid(),
      'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
    })
    .get()
    .json()
  if (resp.result.value !== 'Success') {
    throw new Error(`Failed to create conversation: ${resp.result.value} ${resp.result.message}`)
  }
  return resp
}
