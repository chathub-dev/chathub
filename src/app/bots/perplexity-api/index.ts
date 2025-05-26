import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams, ConversationHistory } from '../abstract-bot'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

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
    public apiKey: string,
    public model: string,
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
    return fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      signal,
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
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
    return this.model;
  }

  get modelName() {
    return this.model;
  }

  get name() {
    return 'Perplexity (API)'
  }
}
