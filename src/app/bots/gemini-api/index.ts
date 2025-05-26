import { GoogleGenerativeAI, ChatSession, GenerativeModel } from '@google/generative-ai'
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams, ConversationHistory } from '../abstract-bot'
import { file2base64 } from '~app/utils/file-utils'

// GeminiApiBotのコンストラクタに渡すオプションの型定義
interface GeminiApiBotOptions {
  geminiApiKey: string;
  geminiApiModel: string;
  geminiApiSystemMessage?: string;
  geminiApiTemperature?: number;
}
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'


interface ChatMessage {
  role: string
  parts: { text: string }[]
}

interface ConversationContext {
  chat: ChatSession
  messages: ChatMessage[]
}

const CONTEXT_SIZE = 40

export abstract class AbstractGeminiApiBot extends AbstractBot {

  private conversationContext?: ConversationContext
  protected genAI!: GoogleGenerativeAI
  protected modelInstance!: GenerativeModel
  
  
  constructor(genAI: GoogleGenerativeAI, model: GenerativeModel) {
    super()
    this.genAI = genAI
    this.modelInstance = model
  }
  
  // ConversationHistoryインターフェースの実装
  public async setConversationHistory(history: ConversationHistory): Promise<void> {
    if (history.messages && Array.isArray(history.messages)) {
      // ChatMessageModelからChatMessageへの変換
      const messages: ChatMessage[] = history.messages.map(msg => {
        if (msg.author === 'user') {
          return {
            role: 'user',
            parts: [{ text: msg.text }]
          };
        } else {
          return {
            role: 'model',
            parts: [{ text: msg.text }]
          };
        }
      });
      
      // チャットセッションを作成
      const chat = await this.modelInstance.startChat({
        history: messages,
      });
      
      this.conversationContext = {
        chat: chat,
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
      let text = '';
      
      if (msg.parts && msg.parts.length > 0 && 'text' in msg.parts[0]) {
        text = msg.parts[0].text || '';
      }
      
      return {
        id: uuid(),
        author: role,
        text: text
      };
    });
    
    return { messages };
  }


  private buildUserMessage(prompt: string): ChatMessage {
    return { role: 'user', parts: [{ text: prompt }] }
  }

  private buildMessages(prompt: string, imageUrl?: string): ChatMessage[] {
    return [
      ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1)),
      this.buildUserMessage(prompt),
    ]
  }

  getSystemMessage() {
    return DEFAULT_CHATGPT_SYSTEM_MESSAGE
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {

      console.log("Creating New Gemini Chat Session.")
      const chat = await this.modelInstance.startChat({
        history: [],
      })
      
      this.conversationContext = { 
        chat: chat,
        messages: []
      }
    }
    else {
      console.log("Creating New Gemini Chat Session with existing message.")
      this.conversationContext.chat = await this.modelInstance.startChat({
        history: this.conversationContext.messages,
      })
    }
    let imageUrl: string | undefined
    if (params.image) {
      imageUrl = await file2base64(params.image)
    }


    try {
      const result = await this.conversationContext.chat.sendMessageStream(params.prompt)

      this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt))

      let text = ''
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        console.debug('gemini stream', chunkText)
        text += chunkText
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text } })
      }

      if (!text) {
        params.onEvent({ type: 'UPDATE_ANSWER', data: { text: 'Empty response' } })
      }

      params.onEvent({ type: 'DONE' })
      this.conversationContext.messages.push({ role: 'model', parts: [{ text }] })

    } catch (error) {
      console.error('Gemini API error:', error)
      params.onEvent({ type: 'ERROR', error: new ChatError('Gemini API error', ErrorCode.GEMINI_API_ERROR) })
    }


  }

  async modifyLastMessage(message: string): Promise<void> {
    console.log('modifyLastMessage', message)
    if (!this.conversationContext || this.conversationContext.messages.length === 0) {
      return
    }

    // 最後のメッセージを取得
    const lastMessage = this.conversationContext.messages[this.conversationContext.messages.length - 1]
    
    // 最後のメッセージがmodelのものでない場合は何もしない
    if (lastMessage.role !== 'model') {
      return
    }

    // 新しいコンテンツで最後のメッセージを更新
    lastMessage.parts = [{ text: message }]

    // チャットセッションも更新
    if (this.modelInstance) {
      this.conversationContext.chat = await this.modelInstance.startChat({
        history: this.conversationContext.messages,
      })
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }



}

export class GeminiApiBot extends AbstractGeminiApiBot {
  private config: GeminiApiBotOptions;

  constructor(options: GeminiApiBotOptions) {
    const currentDate = new Date().toISOString().split('T')[0];
    let systemMessage = options.geminiApiSystemMessage?.replace('{current_date}', currentDate) || '';
    const genAI = new GoogleGenerativeAI(options.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: options.geminiApiModel,
      systemInstruction: systemMessage,
      generationConfig: {
        temperature: options.geminiApiTemperature ?? 0.4,
      },
    });
    super(genAI, model);
    this.config = options; // 設定を保存
  }



  getSystemMessage(): string {
    return this.config.geminiApiSystemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE;
  }

  public getModelName(): string {
    return this.config.geminiApiModel;
  }
  

  get modelName(): string {
    return this.config.geminiApiModel;
  }

  get name() {
    return `Gemini (API)`
  }
}


