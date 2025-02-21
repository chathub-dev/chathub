import { GoogleGenerativeAI, ChatSession, GenerativeModel } from '@google/generative-ai'
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, AsyncAbstractBot, SendMessageParams, MessageParams } from '../abstract-bot'
import { GeminiAPIModel, getUserConfig } from '~services/user-config'
import { file2base64 } from '../bing/utils'


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
        if (this.modelName?.includes('thinking')){
          const parts = text.split('START_MODEL_ANSER: ');
          if (parts.length > 1) {
            params.onEvent({ type: 'UPDATE_ANSWER', data: { text: parts[1] } });
          } else {
            // 分割しても要素が1つしかない場合は元のテキストをそのまま出力
            params.onEvent({ type: 'UPDATE_ANSWER', data: { text } });
          }
        }
        else {
          params.onEvent({ type: 'UPDATE_ANSWER', data: { text } })
        }
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
  constructor(
    private config: Pick<
      UserConfig,
      'geminiApiKey' | 'geminiApiModel' | 'geminiApiSystemMessage' | 'geminiApiTemperature'
    >,
  ) {
    const currentDate = new Date().toISOString().split('T')[0]
    let systemMessage = config.geminiApiSystemMessage.replace('{current_date}', currentDate)
    if (config.geminiApiModel.includes('thinking')){
      systemMessage = 'You must always put "START_MODEL_ANSER: " in the head of your answer.' + systemMessage
    }
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: config.geminiApiModel,
      systemInstruction: systemMessage,
      generationConfig: {
        temperature: config.geminiApiTemperature || 0.4,
      },
    });
    super(genAI, model);
  }



  getSystemMessage() {
    return this.config.geminiApiSystemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE
  }

  public getModelName() {
    return this.config.geminiApiModel
  }
  

  get modelName() {
    return this.config.geminiApiModel
  }

  get name() {
    return `Gemini (${this.config.geminiApiModel})`
  }
}


export class GeminiBot extends AsyncAbstractBot {

  async initializeBot() {
    const { geminiApiKey, geminiApiModel, geminiApiSystemMessage, geminiApiTemperature  } = await getUserConfig()
    if (!geminiApiKey) {
      throw new ChatError('Gemini API key missing', ErrorCode.GEMINI_UNAUTHORIZED)
    }
    if (!geminiApiModel) {
      throw new ChatError('Gemini API model not selected', ErrorCode.GEMINI_CONFIGURATION_ERROR)
    }
    return new GeminiApiBot({geminiApiKey, geminiApiModel, geminiApiSystemMessage, geminiApiTemperature})
  }



  async sendMessage(params: MessageParams) {
    return this.doSendMessageGenerator(params)
  }
}
