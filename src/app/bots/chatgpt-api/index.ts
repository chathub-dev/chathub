import { isArray } from 'lodash-es'
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { UserConfig, getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AsyncAbstractBot, AbstractBot, SendMessageParams, MessageParams, ConversationHistory } from '../abstract-bot'
import { file2base64 } from '~app/utils/file-utils'
import { ChatMessage } from './types'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

interface ConversationContext {
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 40

export abstract class AbstractChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  // ConversationHistoryインターフェースの実装
  public setConversationHistory(history: ConversationHistory): void {
    if (history.messages && Array.isArray(history.messages)) {
      // ChatMessageModelからChatMessageへの変換
      const messages: ChatMessage[] = history.messages.map(msg => {
        if (msg.author === 'user') {
          return {
            role: 'user',
            content: msg.text
          };
        } else {
          return {
            role: 'assistant',
            content: msg.text
          };
        }
      });
      
      this.conversationContext = {
        messages: messages
      };
    }
  }

  public getConversationHistory(): ConversationHistory | undefined {
    if (!this.conversationContext) {
      return undefined;
    }
    
    // ChatMessageからChatMessageModelへの変換
    const messages = this.conversationContext.messages.map(msg => {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      let content = '';
      
      if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (Array.isArray(msg.content)) {
        // 安全にtextプロパティにアクセス
        const textPart = msg.content.find(part => part.type === 'text');
        if (textPart && 'text' in textPart) {
          content = textPart.text || '';
        }
      }
      
      return {
        id: uuid(),
        author: role,
        text: content
      };
    });
    
    return { messages };
  }

  private buildUserMessage(prompt: string, imageUrls?: string[]): ChatMessage {
    if (!imageUrls || imageUrls.length === 0) {
      return { role: 'user', content: prompt }
    }
    
    const content: any[] = [{ type: 'text', text: prompt }];
    imageUrls.forEach(imageUrl => {
      content.push({ type: 'image_url', image_url: { url: imageUrl, detail: 'low' } });
    });
    
    return {
      role: 'user',
      content: content,
    }
  }

  private buildMessages(prompt: string, imageUrls?: string[]): ChatMessage[] {
    const currentDate = new Date().toISOString().split('T')[0]
    const systemMessage = this.getSystemMessage().replace('{current_date}', currentDate)
    return [
      { role: 'system', content: systemMessage },
      ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1)),
      this.buildUserMessage(prompt, imageUrls),
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

    let imageUrls: string[] = []
    if (params.images && params.images.length > 0) {
      imageUrls = await Promise.all(
        params.images.map(image => file2base64(image, true))
      )
    }

    const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt, imageUrls), params.signal)

    // add user message to context only after fetch success
    this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt, imageUrls))

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
          // 思考タグを処理するために共通メソッドを使用
          this.emitUpdateAnswer(params, { text: result.content })
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
  // Define a specific type for the config needed by ChatGPTApiBot
  constructor(
    private config: {
      apiKey: string;
      host: string;
      model: string;
      temperature: number;
      systemMessage: string;
      isHostFullPath?: boolean;
    },
  ) {
    super()
  }

  getSystemMessage() {
    return this.config.systemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE // Use config.systemMessage
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

    const { apiKey: openaiApiKey, host: configHost, isHostFullPath: configIsHostFullPath } = this.config;
    const userConfig = await getUserConfig(); // Get common user config

    const hostValue = configHost || userConfig.customApiHost;
    // Prioritize individual bot's isHostFullPath, then common setting, then default to false.
    const isFullPath = configIsHostFullPath ?? userConfig.isCustomApiHostFullPath ?? false;

    let fullUrlStr: string;

    if (isFullPath) {
      fullUrlStr = hostValue;
    } else {
      const api_path = 'v1/chat/completions'; // Default path
      const baseUrl = hostValue.endsWith('/') ? hostValue.slice(0, -1) : hostValue;
      // Ensure v1 is not duplicated if already present in a non-full-path host
      if (baseUrl.endsWith('/v1')) {
        fullUrlStr = `${baseUrl.slice(0, -3)}/${api_path}`;
      } else {
        fullUrlStr = `${baseUrl}/${api_path}`;
      }
      // Clean up potential double slashes or v1/v1 issues more robustly
      fullUrlStr = fullUrlStr.replace(/([^:]\/)\/+/g, "$1"); // Replace multiple slashes with single (but not after scheme like http://)
      fullUrlStr = fullUrlStr.replace(/\/v1\/v1\//g, "/v1/");
    }
    
    const hasImageInput = messages.some(
      (message) => isArray(message.content) && message.content.some((part) => part.type === 'image_url'),
    )
    
    const resp = await fetch(fullUrlStr, {
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
    const { model: chatgptApiModel } = this.config // Use config.model
    return chatgptApiModel
  }

  get modelName(): string { // Add type annotation
    return this.config.model // Use config.model
  }

  get name() {
    return `ChatGPT (API/${this.config.model})` // Use config.model
  }

  get supportsImageInput() {
    return true
  }



}
