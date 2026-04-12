import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createConversation, fetchOrganizationId, generateChatTitle } from './api'
import { requestHostPermission } from '~app/utils/permissions'
import { ChatError, ErrorCode } from '~utils/errors'

interface ConversationContext {
  conversationId: string
}

export class ClaudeWebBot extends AbstractBot {
  private organizationId?: string
  private conversationContext?: ConversationContext
  private model: string

  constructor() {
    super()
    this.model = 'claude-3-5-sonnet-20241022'
  }

  async doSendMessage(params: SendMessageParams): Promise<void> {
    if (!(await requestHostPermission('https://*.claude.ai/'))) {
      throw new ChatError('Missing claude.ai permission', ErrorCode.MISSING_HOST_PERMISSION)
    }

    if (!this.organizationId) {
      this.organizationId = await fetchOrganizationId()
    }

    if (!this.conversationContext) {
      const conversationId = await createConversation(this.organizationId)
      this.conversationContext = { conversationId }
      generateChatTitle(this.organizationId, conversationId, params.prompt).catch(console.error)
    }

    const resp = await fetch(
      `https://claude.ai/api/organizations/${this.organizationId}/chat_conversations/${this.conversationContext.conversationId}/completion`,
      {
        method: 'POST',
        signal: params.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          model: this.model,
          attachments: [],
          files: [],
        }),
      },
    )

    if (!resp.ok && resp.status === 403) {
      const text = await resp.text()
      if (text.includes('model_not_allowed')) {
        this.model = 'claude-3-haiku-20240307'
        return this.doSendMessage(params)
      }
    }

    let result = ''

    await parseSSEResponse(resp, (message) => {
      console.debug('claude sse message', message)
      const payload = JSON.parse(message)
      if (payload.type === 'content_block_delta' && payload.delta?.type === 'text_delta') {
        result += payload.delta.text
        params.onEvent({
          type: 'UPDATE_ANSWER',
          data: { text: result },
        })
      } else if (payload.completion) {
        // fallback for older SSE format
        result += payload.completion
        params.onEvent({
          type: 'UPDATE_ANSWER',
          data: { text: result.trimStart() },
        })
      } else if (payload.error) {
        throw new Error(JSON.stringify(payload.error))
      }
    })

    params.onEvent({ type: 'DONE' })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get name() {
    return 'Claude (webapp)'
  }
}
