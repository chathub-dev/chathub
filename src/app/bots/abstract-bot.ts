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
  async sendMessage(params: SendMessageParams) {
    try {
      await this.doSendMessage(params)
    } catch (err) {
      console.error(err)
      if (err instanceof ChatError) {
        params.onEvent({ type: 'ERROR', error: err })
      } else if (!params.signal?.aborted) {
        // ignore user abort exception
        params.onEvent({ type: 'ERROR', error: new ChatError((err as Error).message, ErrorCode.UNKOWN_ERROR) })
      }
    }
  }

  get name(): string | undefined {
    return undefined
  }

  abstract doSendMessage(params: SendMessageParams): Promise<void>
  abstract resetConversation(): void
}

class DummyBot extends AbstractBot {
  async doSendMessage(_params: SendMessageParams) {
    // dummy
  }
  resetConversation() {
    // dummy
  }
  get name() {
    return ''
  }
}

export abstract class AsyncAbstractBot extends AbstractBot {
  #bot: AbstractBot

  constructor() {
    super()
    this.#bot = new DummyBot()
    this.initializeBot().then((bot) => {
      this.#bot = bot
    })
  }

  abstract initializeBot(): Promise<AbstractBot>

  doSendMessage(params: SendMessageParams) {
    return this.#bot.doSendMessage(params)
  }

  resetConversation() {
    return this.#bot.resetConversation()
  }

  get name() {
    return this.#bot.name
  }
}
