import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams, ConversationHistory } from '../abstract-bot'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { UserConfig, getUserConfig } from '~services/user-config' // Import getUserConfig

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationContext {
  messages: ChatMessage[]
}

export class PerplexityApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  constructor(
    // Add host and isHostFullPath to constructor parameters, matching CustomApiConfig structure
    private config: {
      apiKey: string;
      model: string;
      host?: string; // Optional, as it might use a common host
      isHostFullPath?: boolean; // Optional
    }
  ) {
    super()
  }

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
      return {
        id: uuid(),
        author: msg.role,
        text: msg.content
      };
    });
    
    return { messages };
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    const message: ChatMessage = { role: 'user', content: params.prompt }
    const resp = await this.fetchCompletionApi([...this.conversationContext.messages, message], params.signal)

    // add user message to context only after fetch success
    this.conversationContext.messages.push(message)

    let answer: string = ''

    await parseSSEResponse(resp, (message) => {
      console.debug('pplx sse message', message)
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      if (data?.choices?.length) {
        const message = data.choices[0].message
        if (message.role === 'assistant' && message.content) {
          answer = message.content
          // 思考タグを処理するために、AbstractBotの共通メソッドを使用
          this.emitUpdateAnswer(params, { text: answer })
        }
      }
    })

    this.conversationContext.messages.push({ role: 'assistant', content: answer })
    params.onEvent({ type: 'DONE' })
  }

  private async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal) {
    const userConfig = await getUserConfig();

    // Determine host and full path flag, prioritizing individual bot config
    const hostValue = this.config.host || userConfig.customApiHost || 'https://api.perplexity.ai'; // Default to official if all blank
    const isFullPath = this.config.isHostFullPath ?? userConfig.isCustomApiHostFullPath ?? false;

    let endpointUrl: string;

    if (isFullPath) {
      endpointUrl = hostValue;
    } else {
      const default_path = 'chat/completions';
      const baseUrl = hostValue.endsWith('/') ? hostValue.slice(0, -1) : hostValue;
      // Perplexity API might not use /v1, so we directly append the default path
      // or use the host as is if it seems to already include a path.
      // This logic might need refinement based on how Perplexity API hosts are typically structured.
      if (baseUrl.includes('/chat/completions')) { // Basic check if path is already there
        endpointUrl = baseUrl;
      } else {
        endpointUrl = `${baseUrl}/${default_path}`;
      }
    }
    // Clean up potential double slashes
    endpointUrl = endpointUrl.replace(/([^:]\/)\/+/g, "$1");

    return fetch(endpointUrl, {
      method: 'POST',
      signal,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    })
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
    lastMessage.content = message
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  public getModelName() {
    return this.config.model;
  }

  get modelName() {
    return this.config.model;
  }

  get name() {
    return 'Perplexity (API)'
  }
}
