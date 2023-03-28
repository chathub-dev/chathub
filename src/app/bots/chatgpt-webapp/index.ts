import { v4 as uuidv4 } from 'uuid'
import { getUserConfig } from '~services/user-config'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { chatGPTClient } from './client'

interface ConversationContext {
  conversationId: string
  lastMessageId: string
}

export class ChatGPTWebBot extends AbstractBot {
  private accessToken?: string
  private conversationContext?: ConversationContext
  private cachedModelNames?: string[]

  constructor() {
    super()
  }

  private async fetchModelNames(): Promise<string[]> {
    if (this.cachedModelNames) {
      return this.cachedModelNames
    }
    const resp = await chatGPTClient.getModels(this.accessToken!)
    this.cachedModelNames = resp.map((r) => r.slug)
    return this.cachedModelNames
  }

  private async getModelName(): Promise<string> {
    const { chatgptWebappModelName } = await getUserConfig()
    if (chatgptWebappModelName !== 'default') {
      return chatgptWebappModelName
    }
    try {
      const modelNames = await this.fetchModelNames()
      return modelNames[0]
    } catch (err) {
      console.error(err)
      return 'text-davinci-002-render'
    }
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.accessToken) {
      this.accessToken = await chatGPTClient.getAccessToken()
    }
    const modelName = await this.getModelName()
    console.debug('Using model:', modelName)

    const resp = await chatGPTClient.fetch('https://chat.openai.com/backend-api/conversation', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        action: 'next',
        messages: [
          {
            id: uuidv4(),
            role: 'user',
            content: {
              content_type: 'text',
              parts: [params.prompt],
            },
          },
        ],
        model: modelName,
        conversation_id: this.conversationContext?.conversationId || undefined,
        parent_message_id: this.conversationContext?.lastMessageId || uuidv4(),
      }),
    })

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' })
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      const text = data.message?.content?.parts?.[0]
      if (text) {
        this.conversationContext = {
          conversationId: data.conversation_id,
          lastMessageId: data.message.id,
        }
        params.onEvent({
          type: 'UPDATE_ANSWER',
          data: { text },
        })
      }
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
