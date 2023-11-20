import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { ChatMessage, ContentPart } from './types'
import { updateTokenUsage } from './usage'
import { file2base64 } from '../bing/utils'
import { isArray } from 'lodash-es'

interface ConversationContext {
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 9

export abstract class AbstractChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  private buildUserMessage(prompt: string, imageUrl?: string): ChatMessage {
    const contents: ContentPart[] = [{ type: 'text', text: prompt }]
    if (imageUrl) {
      contents.push({
        type: 'image_url',
        image_url: { url: imageUrl, detail: 'low' },
      })
    }
    return { role: 'user', content: contents }
  }

  private buildMessages(prompt: string, imageUrl?: string): ChatMessage[] {
    const currentDate = new Date().toISOString().split('T')[0]
    const systemMessage = this.getSystemMessage().replace('{current_date}', currentDate)
    return [
      { role: 'system', content: systemMessage },
      ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1)),
      this.buildUserMessage(prompt, imageUrl),
    ]
  }

  getSystemMessage() {
    return DEFAULT_CHATGPT_SYSTEM_MESSAGE
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    let imageUrl: string | undefined
    if (params.image) {
      imageUrl = await file2base64(params.image, true)
    }

    const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt, imageUrl), params.signal)

    // add user message to context only after fetch success
    this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt, imageUrl))

    let done = false
    const result: ChatMessage = { role: 'assistant', content: '' }

    const finish = () => {
      done = true
      params.onEvent({ type: 'DONE' })
      const messages = this.conversationContext!.messages
      messages.push(result)
      updateTokenUsage(messages).catch(console.error)
    }

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
      if (message === '[DONE]') {
        finish()
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      if (data?.choices?.length) {
        const delta = data.choices[0].delta
        if (delta?.content) {
          result.content += delta.content
          params.onEvent({
            type: 'UPDATE_ANSWER',
            data: { text: result.content },
          })
        }
      }
    })

    if (!done) {
      finish()
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  abstract fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal): Promise<Response>
}

export class ChatGPTApiBot extends AbstractChatGPTApiBot {
  constructor(
    private config: Pick<
      UserConfig,
      'openaiApiKey' | 'openaiApiHost' | 'chatgptApiModel' | 'chatgptApiTemperature' | 'chatgptApiSystemMessage'
    >,
  ) {
    super()
  }

  getSystemMessage() {
    return this.config.chatgptApiSystemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const { openaiApiKey, openaiApiHost } = this.config
    const hasImageInput = messages.some(
      (message) => isArray(message.content) && message.content.some((part) => part.type === 'image_url'),
    )
    const model = hasImageInput ? 'gpt-4-vision-preview' : this.getModelName()
    const resp = await fetch(`${openaiApiHost}/v1/chat/completions`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: hasImageInput ? 500 : undefined,
        stream: true,
      }),
    })
    if (!resp.ok) {
      const error = await resp.text()
      if (error.includes('insufficient_quota')) {
        throw new ChatError('Insufficient ChatGPT API usage quota', ErrorCode.CHATGPT_INSUFFICIENT_QUOTA)
      }
    }
    return resp
  }

  private getModelName() {
    const { chatgptApiModel } = this.config
    if (chatgptApiModel === 'gpt-4-turbo') {
      return 'gpt-4-1106-preview'
    }
    if (chatgptApiModel === 'gpt-3.5-turbo') {
      return 'gpt-3.5-turbo-1106'
    }
    return chatgptApiModel
  }

  get name() {
    return `ChatGPT (API/${this.config.chatgptApiModel})`
  }

  get supportsImageInput() {
    return true
  }
}
