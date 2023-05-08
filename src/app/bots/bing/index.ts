import WebSocketAsPromised from 'websocket-as-promised'
import { BingConversationStyle, getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createConversation } from './api'
import { ChatResponseMessage, ConversationInfo, InvocationEventType } from './types'
import { convertMessageToMarkdown, websocketUtils } from './utils'

const styleOptionsMap: Record<BingConversationStyle, string[]> = {
  [BingConversationStyle.Balanced]: [
    'nlu_direct_response_filter',
    'deepleo',
    'disable_emoji_spoken_text',
    'responsible_ai_policy_235',
    'enablemm',
    'galileo',
    'dv3sugg',
    'responseos',
    'e2ecachewrite',
    'cachewriteext',
    'nodlcpcwrite',
    'travelansgnd',
    'nojbfedge',
  ],
  [BingConversationStyle.Creative]: [
    'nlu_direct_response_filter',
    'deepleo',
    'disable_emoji_spoken_text',
    'responsible_ai_policy_235',
    'enablemm',
    'h3imaginative',
    'travelansgnd',
    'dv3sugg',
    'clgalileo',
    'gencontentv3',
    'dv3sugg',
    'responseos',
    'e2ecachewrite',
    'cachewriteext',
    'nodlcpcwrite',
    'travelansgnd',
    'nojbfedge',
  ],
  [BingConversationStyle.Precise]: [
    'nlu_direct_response_filter',
    'deepleo',
    'disable_emoji_spoken_text',
    'responsible_ai_policy_235',
    'enablemm',
    'galileo',
    'dv3sugg',
    'responseos',
    'e2ecachewrite',
    'cachewriteext',
    'nodlcpcwrite',
    'travelansgnd',
    'h3precise',
    'clgalileo',
    'nojbfedge',
  ],
}

export class BingWebBot extends AbstractBot {
  private conversationContext?: ConversationInfo

  private buildChatRequest(conversation: ConversationInfo, message: string) {
    const optionsSets = styleOptionsMap[conversation.conversationStyle]
    return {
      arguments: [
        {
          source: 'cib',
          optionsSets,
          allowedMessageTypes: [
            'Chat',
            'InternalSearchQuery',
            'Disengaged',
            'InternalLoaderMessage',
            'SemanticSerp',
            'GenerateContentQuery',
            'SearchQuery',
          ],
          sliceIds: [
            'chk1cf',
            'nopreloadsscf',
            'winlongmsg2tf',
            'perfimpcomb',
            'sugdivdis',
            'sydnoinputt',
            'wpcssopt',
            'wintone2tf',
            '0404sydicnbs0',
            '405suggbs0',
            'scctl',
            '330uaugs0',
            '0329resp',
            'udscahrfon',
            'udstrblm5',
            '404e2ewrt',
            '408nodedups0',
            '403tvlansgnd',
          ],
          isStartOfSession: conversation.invocationId === 0,
          message: {
            author: 'user',
            inputMethod: 'Keyboard',
            text: message,
            messageType: 'Chat',
          },
          conversationId: conversation.conversationId,
          conversationSignature: conversation.conversationSignature,
          participant: { id: conversation.clientId },
        },
      ],
      invocationId: conversation.invocationId.toString(),
      target: 'chat',
      type: InvocationEventType.StreamInvocation,
    }
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      const [conversation, { bingConversationStyle }] = await Promise.all([createConversation(), getUserConfig()])
      this.conversationContext = {
        conversationId: conversation.conversationId,
        conversationSignature: conversation.conversationSignature,
        clientId: conversation.clientId,
        invocationId: 0,
        conversationStyle: bingConversationStyle,
      }
    }

    const conversation = this.conversationContext!

    const wsp = new WebSocketAsPromised('wss://sydney.bing.com/sydney/ChatHub', {
      packMessage: websocketUtils.packMessage,
      unpackMessage: websocketUtils.unpackMessage,
    })

    wsp.onUnpackedMessage.addListener((events) => {
      for (const event of events) {
        if (JSON.stringify(event) === '{}') {
          wsp.sendPacked({ type: 6 })
          wsp.sendPacked(this.buildChatRequest(conversation, params.prompt))
          conversation.invocationId += 1
        } else if (event.type === 6) {
          wsp.sendPacked({ type: 6 })
        } else if (event.type === 3) {
          params.onEvent({ type: 'DONE' })
          wsp.removeAllListeners()
          wsp.close()
        } else if (event.type === 1) {
          const text = convertMessageToMarkdown(event.arguments[0].messages[0])
          params.onEvent({ type: 'UPDATE_ANSWER', data: { text } })
        } else if (event.type === 2) {
          const messages = event.item.messages as ChatResponseMessage[]
          const limited = messages.some((message) => message.contentOrigin === 'TurnLimiter')
          if (limited) {
            params.onEvent({
              type: 'ERROR',
              error: new ChatError(
                'Sorry, you have reached chat turns limit in this conversation.',
                ErrorCode.CONVERSATION_LIMIT,
              ),
            })
          }
        }
      }
    })

    wsp.onClose.addListener(() => {
      params.onEvent({ type: 'DONE' })
    })

    params.signal?.addEventListener('abort', () => {
      wsp.removeAllListeners()
      wsp.close()
    })

    await wsp.open()
    wsp.sendPacked({ protocol: 'json', version: 1 })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
