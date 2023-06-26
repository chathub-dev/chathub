import { createParser } from 'eventsource-parser'
import { isEmpty } from 'lodash-es'
import { ChatError, ErrorCode } from './errors'
import { streamAsyncIterable } from './stream-async-iterable'

export async function parseSSEResponse(resp: Response, onMessage: (message: string) => void) {
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    if (!isEmpty(error)) {
      throw new Error(JSON.stringify(error))
    }
    throw new ChatError(`${resp.status} ${resp.statusText}`, ErrorCode.NETWORK_ERROR)
  }
  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })
  const decoder = new TextDecoder()
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    const str = decoder.decode(chunk)
    parser.feed(str)
  }
}
