import { ofetch } from 'ofetch'
import WebSocketAsPromised from 'websocket-as-promised'
import { requestHostPermission } from '~app/utils/permissions'
import { BingConversationStyle, getUserConfig } from '~services/user-config'
import { uuid } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createConversation } from './api'
import { ChatResponseMessage, ConversationInfo, InvocationEventType } from './types'
import { convertMessageToMarkdown, file2base64, websocketUtils } from './utils'

const OPTIONS_SETS = [
  'nlu_direct_response_filter',
  'deepleo',
  'disable_emoji_spoken_text',
  'responsible_ai_policy_235',
  'enablemm',
  'dv3sugg',
  'iyxapbing',
  'iycapbing',
  'galileo',
  'saharagenconv5',
  'log2sph',
  'savememfilter',
  'uprofgen',
  'uprofupd',
  'uprofupdasy',
  'vidsumsnip',
]

const SLICE_IDS = [
  'tnaenableux',
  'adssqovr',
  'tnaenable',
  'arankc_1_9_3',
  'rankcf',
  '0731ziv2s0',
  '926buffall',
  'inosanewsmob',
  'wrapnoins',
  'prechr',
  'sydtransl',
  '806log2sph',
  '927uprofasy',
  '919vidsnip',
  '829suggtrims0',
]

export class BingWebBot extends AbstractBot {
  private conversationContext?: ConversationInfo

  private buildChatRequest(conversation: ConversationInfo, message: string, imageUrl?: string) {
    const requestId = uuid()

    const optionsSets = [...OPTIONS_SETS]
    let tone = 'Balanced'
    if (conversation.conversationStyle === BingConversationStyle.Precise) {
      optionsSets.push('h3precise')
      tone = 'Precise'
    } else if (conversation.conversationStyle === BingConversationStyle.Creative) {
      optionsSets.push('h3imaginative')
      tone = 'Creative'
    }

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
          sliceIds: SLICE_IDS,
          verbosity: 'verbose',
          scenario: 'SERP',
          plugins: [],
          conversationHistoryOptionsSets: ['autosave', 'savemem', 'uprofupd', 'uprofgen'],
          isStartOfSession: conversation.invocationId === 0,
          message: {
            timestamp: new Date().toISOString(),
            author: 'user',
            inputMethod: 'Keyboard',
            text: message,
            imageUrl,
            messageType: 'Chat',
            requestId,
            messageId: requestId,
          },
          requestId,
          conversationId: conversation.conversationId,
          conversationSignature: conversation.conversationSignature,
          participant: { id: conversation.clientId },
          tone,
        },
      ],
      invocationId: conversation.invocationId.toString(),
      target: 'chat',
      type: InvocationEventType.StreamInvocation,
    }
  }

  async doSendMessage(params: SendMessageParams) {
    if (!(await requestHostPermission('wss://*.bing.com/'))) {
      throw new ChatError('Missing bing.com permission', ErrorCode.MISSING_HOST_PERMISSION)
    }
    if (!this.conversationContext) {
      const [conversation, { bingConversationStyle }] = await Promise.all([createConversation(), getUserConfig()])
      this.conversationContext = {
        conversationId: conversation.conversationId,
        conversationSignature: conversation.conversationSignature,
        encryptedConversationSignature: conversation.encryptedConversationSignature,
        clientId: conversation.clientId,
        invocationId: 0,
        conversationStyle: bingConversationStyle,
      }
    }

    const conversation = this.conversationContext!

    let imageUrl: string | undefined
    if (params.image) {
      imageUrl = await this.uploadImage(params.image)
    }

    const wsp = new WebSocketAsPromised(this.buildWssUrl(conversation.encryptedConversationSignature), {
      packMessage: websocketUtils.packMessage,
      unpackMessage: websocketUtils.unpackMessage,
    })

    let receivedAnswer = false

    wsp.onUnpackedMessage.addListener((events) => {
      for (const event of events) {
        console.debug('bing ws event', event)
        if (JSON.stringify(event) === '{}') {
          wsp.sendPacked({ type: 6 })
          wsp.sendPacked(this.buildChatRequest(conversation, params.prompt, imageUrl))
          conversation.invocationId += 1
        } else if (event.type === 6) {
          wsp.sendPacked({ type: 6 })
        } else if (event.type === 3) {
          params.onEvent({ type: 'DONE' })
          wsp.removeAllListeners()
          wsp.close()
        } else if (event.type === 1) {
          const messages = event.arguments[0].messages
          if (messages) {
            receivedAnswer = true
            const text = convertMessageToMarkdown(messages[0])
            params.onEvent({ type: 'UPDATE_ANSWER', data: { text } })
          }
        } else if (event.type === 2) {
          const messages = event.item.messages as ChatResponseMessage[] | undefined
          if (!messages) {
            if (event.item.result.value === 'UnauthorizedRequest') {
              this.conversationContext = undefined
              params.onEvent({
                type: 'ERROR',
                error: new ChatError('UnauthorizedRequest', ErrorCode.BING_UNAUTHORIZED),
              })
              return
            }
            const captcha = event.item.result.value === 'CaptchaChallenge'
            if (captcha) {
              this.conversationContext = undefined
            }
            params.onEvent({
              type: 'ERROR',
              error: new ChatError(
                event.item.result.error || 'Unknown error',
                captcha ? ErrorCode.BING_CAPTCHA : ErrorCode.UNKOWN_ERROR,
              ),
            })
            return
          }
          const limited = messages.some((message) => message.contentOrigin === 'TurnLimiter')
          if (limited) {
            params.onEvent({
              type: 'ERROR',
              error: new ChatError(
                'Sorry, you have reached chat turns limit in this conversation.',
                ErrorCode.CONVERSATION_LIMIT,
              ),
            })
            return
          }
          if (!receivedAnswer) {
            const message = event.item.messages[event.item.firstNewMessageIndex] as ChatResponseMessage
            if (message) {
              receivedAnswer = true
              const text = convertMessageToMarkdown(message)
              params.onEvent({
                type: 'UPDATE_ANSWER',
                data: { text },
              })
            }
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

    try {
      await wsp.open()
    } catch (err) {
      wsp.removeAllListeners()
      throw new ChatError((err as Error).message, ErrorCode.NETWORK_ERROR)
    }

    wsp.sendPacked({ protocol: 'json', version: 1 })
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  get supportsImageInput() {
    return true
  }

  private async uploadImage(image: File) {
    const formData = new FormData()
    formData.append(
      'knowledgeRequest',
      JSON.stringify({
        imageInfo: {},
        knowledgeRequest: {
          invokedSkills: ['ImageById'],
          subscriptionId: 'Bing.Chat.Multimodal',
          invokedSkillsRequestData: { enableFaceBlur: false },
          convoData: { convoid: '', convotone: 'Balanced' },
        },
      }),
    )
    formData.append('imageBase64', await file2base64(image))
    const resp = await ofetch<{ blobId: string }>('https://www.bing.com/images/kblob', {
      method: 'POST',
      body: formData,
    })
    if (!resp.blobId) {
      console.debug('kblob response: ', resp)
      throw new Error('Failed to upload image')
    }
    return `https://www.bing.com/images/blob?bcid=${resp.blobId}`
  }

  private buildWssUrl(encryptedConversationSignature: string | undefined) {
    if (!encryptedConversationSignature) {
      return 'wss://sydney.bing.com/sydney/ChatHub'
    }
    return `wss://sydney.bing.com/sydney/ChatHub?sec_access_token=${encodeURIComponent(encryptedConversationSignature)}`
  }
}
