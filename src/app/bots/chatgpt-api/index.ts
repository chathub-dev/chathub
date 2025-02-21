import { isArray } from 'lodash-es'
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { UserConfig, getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AsyncAbstractBot, AbstractBot, SendMessageParams, MessageParams } from '../abstract-bot'
import { file2base64 } from '../bing/utils'
import { ChatMessage } from './types'

interface ConversationContext {
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 40

export abstract class AbstractChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  private buildUserMessage(prompt: string, imageUrl?: string): ChatMessage {
    if (!imageUrl) {
      return { role: 'user', content: prompt }
    }
    return {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'low' } },
      ],
    }
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

  async modifyLastMessage(message: string): Promise<void> {
    console.log('modifyLastMessage', message)
    if (!this.conversationContext || this.conversationContext.messages.length === 0) {
      return
    }

    // 最後のメッセージを取得
    const lastMessage = this.conversationContext.messages[this.conversationContext.messages.length - 1]
    
    // 最後のメッセージがassistantのものでない場合は何もしない
    if (lastMessage.role !== 'assistant') {
      return
    }

    // 新しいコンテンツで最後のメッセージを更新
    if (typeof message === 'string') {
      lastMessage.content = message
    }
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

    const model = this.getModelName()

    if (model === 'o1' || model.startsWith('o1-')) {
      // System PromptはArrayの最初の要素にしか存在しないから、一番目だけチェックする
      if (messages[0]?.role === 'system') {
        const systemMessage = messages[0];
        messages[0] = {
          role: 'user',
          content: systemMessage.content,
        };
      }
    }

    const { openaiApiKey, openaiApiHost } = this.config
    const hasImageInput = messages.some(
      (message) => isArray(message.content) && message.content.some((part) => part.type === 'image_url'),
    )

    
    const api_path = 'v1/chat/completions';
    // API Hostの最後のslashを削除
    const baseUrl = openaiApiHost.endsWith('/') ? openaiApiHost.slice(0, -1) : openaiApiHost;
    const fullUrlStr = `${baseUrl}/${api_path}`.replace('v1/v1/', 'v1/')
    
    
    const resp = await fetch(`${fullUrlStr}`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: undefined,
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
  

  public getModelName() {
    const { chatgptApiModel } = this.config
    return chatgptApiModel
  }

  get modelName() {
    return this.config.chatgptApiModel
  }

  get name() {
    return `ChatGPT (API/${this.config.chatgptApiModel})`
  }

  get supportsImageInput() {
    return true
  }



}
