import { isArray } from 'lodash-es'
import { DEFAULT_CLAUDE_SYSTEM_MESSAGE } from '~app/consts'
import { requestHostPermission } from '~app/utils/permissions'
import { UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams, ConversationHistory } from '../abstract-bot'
import { file2base64 } from '~app/utils/file-utils'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

interface ChatMessage {
  role: string
  content: string | { type: string; [key: string]: any }[]
}

interface ConversationContext {
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 40

export abstract class AbstractClaudeApiBot extends AbstractBot {
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
        // contentが配列の場合、typeがtextの要素からテキストを抽出
        const textContent = msg.content.find(part => part.type === 'text');
        if (textContent && 'text' in textContent) {
          content = textContent.text || '';
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

  private buildUserMessage(prompt: string, imageBase64Data?: string, imageMediaType?: string): ChatMessage {
    if (!imageBase64Data || !imageMediaType) {
      return { role: 'user', content: prompt }
    }
    return {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image', source: { type: 'base64', media_type: imageMediaType, data: imageBase64Data } },
      ],
    }
  }

    private buildMessages(prompt: string, imageBase64Data?: string, imageMediaType?: string): ChatMessage[] {
      return [
        ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1)),
        this.buildUserMessage(prompt, imageBase64Data, imageMediaType),
      ]
    }

  getSystemMessage() {
    return DEFAULT_CLAUDE_SYSTEM_MESSAGE
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    let imageMediaType: string | undefined
    let imageBase64Data: string | undefined
    if (params.image) {
      const dataUrl = await file2base64(params.image, true) // keepHeader = true
      const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
      if (match) {
        imageMediaType = match[1]
        imageBase64Data = match[2]
      } else {
        console.error("Could not parse data URL for image:", dataUrl)
        // フォールバック: データ部分のみを使用し、デフォルトでJPEGを指定（元の挙動に近い）
        imageBase64Data = dataUrl.replace('data:', '').replace(/^.+,/, '')
        imageMediaType = 'image/jpeg';
      }
    }

    const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt, imageBase64Data, imageMediaType), params.signal)

    // add user message to context only after fetch success
    this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt, imageBase64Data, imageMediaType))

    let done = false
    const result: ChatMessage = { role: 'assistant', content: '' }
    let thinkingContent = '';

    const finish = () => {
      done = true
      params.onEvent({ type: 'DONE' })
      const messages = this.conversationContext!.messages
      messages.push(result)
    }

    await parseSSEResponse(resp, (message) => {
      console.debug('claude sse message', message)
      try {
        const data = JSON.parse(message)
        if (data.type === 'content_block_start' && data.content_block?.type === 'thinking') {
          thinkingContent = ''; // Reset thinking content at the start of a new block
        } else if (data.type === 'content_block_delta' && data.delta?.type === 'thinking_delta') {
          // Thinking モードの出力の処理
          thinkingContent += data.delta.thinking || '';
          params.onEvent({
            type: 'UPDATE_ANSWER',
            data: {
              text: typeof result.content === 'string' ? result.content : '',
              thinking: thinkingContent,
            },
          });
        } else if (data.type === 'content_block_start' || data.type === 'content_block_delta') {
          if (data.delta?.text) {
            if (typeof result.content === 'string') {
              result.content += data.delta.text
            } else {
              result.content = data.delta.text
            }
            params.onEvent({
              type: 'UPDATE_ANSWER',
              data: {
                text: typeof result.content === 'string' ? result.content : '',
                thinking: thinkingContent || undefined,
              },
            });
          }
        } else if (data.type === 'message_stop') {
          finish()
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    })

    if (!done) {
      finish()
    }
  }

    /**
   * modifyLastMessage:
   * conversationContext 内の最後のメッセージが assistant のものであれば、
   * その content を引数 message の内容で上書きします。
   */
  async modifyLastMessage(message: string): Promise<void> {
    if (!this.conversationContext || this.conversationContext.messages.length === 0) {
      return
    }
    const lastMessage = this.conversationContext.messages[this.conversationContext.messages.length - 1]
    if (lastMessage.role !== 'assistant') {
      return
    }
    if (typeof lastMessage.content === 'string') {
      lastMessage.content = message
    } else if (Array.isArray(lastMessage.content)) {
      // parts 配列の場合、先頭要素の text を更新できるようにする
      if (lastMessage.content.length > 0 && typeof lastMessage.content[0].text === 'string') {
        lastMessage.content[0].text = message
      } else {
        lastMessage.content = [{ type: 'text', text: message }]
      }
    }
    console.log('Claude modifyLastMessage updated to:', message)
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  abstract fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal): Promise<Response>
}

export class ClaudeApiBot extends AbstractClaudeApiBot {
  private thinkingMode: boolean;

  // Define a specific type for the config needed by ClaudeApiBot
  constructor(
    private config: {
      apiKey: string;
      host: string;
      model: string;
      systemMessage: string;
      temperature: number;
      thinkingBudget?: number;
    },
    thinkingMode: boolean = false,
    private useCustomAuthorizationHeader: boolean = false
  ) {
    super()
    this.thinkingMode = thinkingMode;
  }

  getSystemMessage() {
    const currentDate = new Date().toISOString().split('T')[0]
    const systemMessage = this.config.systemMessage.replace('{current_date}', currentDate)  || DEFAULT_CLAUDE_SYSTEM_MESSAGE // Use config.systemMessage
    return systemMessage
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const hasImageInput = messages.some(
      (message) => isArray(message.content) && message.content.some((part) => part.type === 'image')
    );

    const body: any = {
      model: this.getModelName(),
      messages,
      max_tokens: hasImageInput ? 4096 : 8192,
      stream: true,
      system: this.getSystemMessage(),
    }

    // Add reasoning configuration or temperature based on thinkingMode flag
    if (this.thinkingMode) {
      body.thinking = {
        type: "enabled",
        budget_tokens: this.config.thinkingBudget || 2000 // Use config.thinkingBudget
      };
      // Temperature is not used in Thinking Mode, so set to undefined
      body.temperature = undefined;
    } else {
      body.temperature = this.config.temperature; // Use config.temperature
    }

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    };

    if (this.useCustomAuthorizationHeader) {
      headers['Authorization'] = this.config.apiKey; // Use config.apiKey
    } else {
      headers['x-api-key'] = this.config.apiKey; // Use config.apiKey
    }

    const api_path = 'v1/messages';
    // API Hostの最後のslashを削除
    const baseUrl = this.config.host.endsWith('/') ? this.config.host.slice(0, -1) : this.config.host; // Use config.host
    const fullUrlStr = `${baseUrl}/${api_path}`.replace('v1/v1/', 'v1/')
    
    const resp = await fetch(fullUrlStr, {
      method: 'POST',
      signal,
      headers,
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      const error = await resp.text()
      if (error.includes('insufficient_quota')) {
        throw new ChatError('Insufficient Claude API usage quota', ErrorCode.CLAUDE_INSUFFICIENT_QUOTA)
      }
      }
    return resp
  }

  public getModelName() {
    const { model: claudeApiModel } = this.config // Use config.model
    return claudeApiModel
  }

  get modelName(): string { // Add type annotation
    return this.config.model // Use config.model
  }

  get name(): string { // Add type annotation
    return this.thinkingMode ? `Claude (Thinking)` : `Claude` // Restore getter body
  }

  get supportsImageInput() {
    return true
  }
}
