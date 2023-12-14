import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai'
import { AbstractBot, AsyncAbstractBot, SendMessageParams } from '../abstract-bot'
import { getUserConfig } from '~services/user-config'

interface ConversationContext {
  chatSession: ChatSession
}

export class GeminiApiBot extends AbstractBot {
  private conversationContext?: ConversationContext
  sdk: GoogleGenerativeAI

  constructor(public apiKey: string) {
    super()
    this.sdk = new GoogleGenerativeAI(apiKey)
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      const model = this.sdk.getGenerativeModel({ model: 'gemini-pro' })
      const chatSession = model.startChat()
      this.conversationContext = { chatSession }
    }

    const result = await this.conversationContext.chatSession.sendMessageStream(params.prompt)

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
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return 'Gemini Pro'
  }
}

export class GeminiBot extends AsyncAbstractBot {
  async initializeBot() {
    const { geminiApiKey } = await getUserConfig()
    if (!geminiApiKey) {
      throw new Error('Gemini API key missing')
    }
    return new GeminiApiBot(geminiApiKey)
  }
}
