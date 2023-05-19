import { v4 as uuidv4 } from 'uuid'
import { ChatGPTWebModels, getUserConfig } from '~services/user-config'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { chatGPTClient } from './client'
import { ResponseContent } from './types'
import { CHATGPT_WEB_3_5_MODEL } from '~app/consts'

function removeCitations(text: string) {
  return text.replaceAll(/\u3010\d+\u2020source\u3011/g, '')
}

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
    this.cachedModelNames = resp.map((r) => r.slug).filter((slug) => !slug.includes('plugins'))
    return this.cachedModelNames
  }

  private async getModelName(): Promise<string> {
    const { chatgptWebappModelName } = await getUserConfig()
    if (chatgptWebappModelName === ChatGPTWebModels['GPT-4']) {
      return 'gpt-4'
    }
    if (chatgptWebappModelName === ChatGPTWebModels['GPT-4 Browsing']) {
      return 'gpt-4-browsing'
    }
    return 'text-davinci-002-render-sha'
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
            author: { role: 'user' },
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
      const content = data.message?.content as ResponseContent | undefined
      if (!content) {
        return
      }
      let text: string
      if (content.content_type === 'text') {
        text = content.parts[0]
        text = removeCitations(text)
      } else if (content.content_type === 'code') {
        text = '_' + content.text + '_'
      } else {
        return
      }
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
