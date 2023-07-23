import { AbstractBot, SendMessageParams } from '../abstract-bot'
import Claude2BotAPI from './api'

interface ConversationContext {
  requestParams: Awaited<ReturnType<typeof fetchRequestParams>>
  contextIds: [string, string, string]
}

const claude = new Claude2BotAPI();

export class Claude2Bot extends AbstractBot {
  private conversationContext?: ConversationContext

  async doSendMessage(params: SendMessageParams) {
    const PARAMS = {
      progress(a) {
        if (a.completion) {
          params.onEvent({type: 'UPDATE_ANSWER', data: {text: a.completion}})
        }
      },
      done(a) {
        if (a.completion) {
          params.onEvent({type: 'UPDATE_ANSWER', data: {text: a.completion}})
        }
        params.onEvent({type: "DONE" })
      }
    }
    if (!claude.ready) { 
      console.debug('Claude loading...')
      await claude.init();
    }
    console.debug('Claude ready')
    if (!this.conversationContext) {
      this.conversationContext = {
        conversation: await claude.startConversation(params.prompt, PARAMS)
      }
      return;
    }
    const { conversation } = this.conversationContext;
    await claude.sendMessage(params.prompt, {conversation: await claude.getConversation(conversation), ...PARAMS})
    return;
    params.onEvent({
      type: 'UPDATE_ANSWER',
      data: { text },
    })
    params.onEvent({ type: 'DONE' })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
