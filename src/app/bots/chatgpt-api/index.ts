import { getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { CHATGPT_SYSTEM_MESSAGE } from './consts'

interface ChatMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
}

interface ConversationContext {
  messages: ChatMessage[]
}

export class ChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    const { openaiApiKey } = await getUserConfig()
    if (!openaiApiKey) {
      throw new ChatError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET)
    }
    if (!this.conversationContext) {
      this.conversationContext = {
        messages: [{ role: 'system', content: CHATGPT_SYSTEM_MESSAGE }],
      }
    }
    this.conversationContext.messages.push({ role: 'user', content: params.prompt })

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.conversationContext.messages,
        temperature: 0.6,
        stream: true,
      }),
    })

    const result: ChatMessage = { role: 'assistant', content: '' }

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' })
        this.conversationContext!.messages.push(result)
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
          params.onEvent({
            type: 'UPDATE_ANSWER',
            data: { text: result.content },
          })
        }
      }
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
