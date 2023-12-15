import { Sentry } from '~services/sentry'
import { ChatError, ErrorCode } from '~utils/errors'
import { streamAsyncIterable } from '~utils/stream-async-iterable'

export type AnwserPayload = {
  text: string
}

export type Event =
  | {
      type: 'UPDATE_ANSWER'
      data: AnwserPayload
    }
  | {
      type: 'DONE'
    }
  | {
      type: 'ERROR'
      error: ChatError
    }

export interface MessageParams {
  prompt: string
  rawUserInput?: string
  image?: File
  signal?: AbortSignal
}

export interface SendMessageParams extends MessageParams {
  onEvent: (event: Event) => void
}

export abstract class AbstractBot {
  public async sendMessage(params: MessageParams) {
    return this.doSendMessageGenerator(params)
  }

  protected async *doSendMessageGenerator(params: MessageParams) {
    const wrapError = (err: unknown) => {
      Sentry.captureException(err)
      if (err instanceof ChatError) {
        return err
      }
      if (!params.signal?.aborted) {
        // ignore user abort exception
        return new ChatError((err as Error).message, ErrorCode.UNKOWN_ERROR)
      }
    }
    const stream = new ReadableStream<AnwserPayload>({
      start: (controller) => {
        this.doSendMessage({
          prompt: params.prompt,
          rawUserInput: params.rawUserInput,
          image: params.image,
          signal: params.signal,
          onEvent(event) {
            if (event.type === 'UPDATE_ANSWER') {
              controller.enqueue(event.data)
            } else if (event.type === 'DONE') {
              controller.close()
            } else if (event.type === 'ERROR') {
              const error = wrapError(event.error)
              if (error) {
                controller.error(error)
              }
            }
          },
        }).catch((err) => {
          const error = wrapError(err)
          if (error) {
            controller.error(error)
          }
        })
      },
    })
    yield* streamAsyncIterable(stream)
  }

  get name(): string | undefined {
    return undefined
  }

  get supportsImageInput() {
    return false
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
  #initializeError?: Error

  constructor() {
    super()
    this.#bot = new DummyBot()
    this.initializeBot()
      .then((bot) => {
        this.#bot = bot
      })
      .catch((err) => {
        this.#initializeError = err
      })
  }

  abstract initializeBot(): Promise<AbstractBot>

  doSendMessage(params: SendMessageParams) {
    if (this.#bot instanceof DummyBot && this.#initializeError) {
      throw this.#initializeError
    }
    return this.#bot.doSendMessage(params)
  }

  resetConversation() {
    return this.#bot.resetConversation()
  }

  get name() {
    return this.#bot.name
  }

  get supportsImageInput() {
    return this.#bot.supportsImageInput
  }
}
