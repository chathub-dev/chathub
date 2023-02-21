import { ErrorCode } from '~utils/errors'

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
      data: {
        code: ErrorCode
        message: string
      }
    }

export interface SendMessageParams {
  prompt: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
}

export abstract class AbstractBot {
  abstract name: string
  abstract logo: string
  abstract sendMessage(params: SendMessageParams): Promise<void>
  abstract resetConversation(): Promise<void>
}
