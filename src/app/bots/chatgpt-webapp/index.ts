import { v4 as uuidv4 } from 'uuid'
import logo from '~/assets/chatgpt-logo.svg'
import { fetchSSE } from '~/utils/fetch-sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { getChatGPTAccessToken, requestBackendAPIWithToken } from './api'

interface ConversationContext {
  conversationId: string
  lastMessageId: string
}

export class ChatGPTWebBot implements AbstractBot {
  name = 'ChatGPT'
  logo = logo

  private accessToken?: string
  private conversationContext?: ConversationContext
  private modelName?: string

  private async fetchModels(): Promise<{ slug: string; title: string; description: string; max_tokens: number }[]> {
    const resp = await requestBackendAPIWithToken(this.accessToken!, 'GET', '/models').then((r) => r.json())
    return resp.models
  }

  private async getModelName(): Promise<string> {
    if (this.modelName) {
      return this.modelName
    }
    try {
      const models = await this.fetchModels()
      this.modelName = models[0].slug
      return this.modelName
    } catch (err) {
      console.error(err)
      return 'text-davinci-002-render'
    }
  }

  async sendMessage(params: SendMessageParams) {
    if (!this.accessToken) {
      this.accessToken = await getChatGPTAccessToken()
    }
    const modelName = await this.getModelName()
    console.debug('Using model:', modelName)

    await fetchSSE('https://chat.openai.com/backend-api/conversation', {
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
      onMessage: (message: string) => {
        console.debug('sse message', message)
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
      },
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
