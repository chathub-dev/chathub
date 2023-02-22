import { ChatError, ErrorCode } from '~utils/errors'

export type Event =
  | {
      type: 'UPDATE_ANSWER'
      data: {
        text: string
      }
    }
  | {
      type: 'DONE'
    }
  | {
      type: 'ERROR'
      error: ChatError
    }

export interface SendMessageParams {
  prompt: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
}

export abstract class AbstractBot {
  abstract name: string
  abstract logo: string

  async sendMessage(params: SendMessageParams) {
    try {
      await this.doSendMessage(params)
    } catch (err) {
      console.error(err)
      if (err instanceof ChatError) {
        params.onEvent({ type: 'ERROR', error: err })
      } else {
        params.onEvent({ type: 'ERROR', error: new ChatError((err as Error).message, ErrorCode.UNKOWN_ERROR) })
      }
    }
  }

  abstract doSendMessage(params: SendMessageParams): Promise<void>
  abstract resetConversation(): void
}
