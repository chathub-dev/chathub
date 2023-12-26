import { ClaudeMode, getUserConfig } from '~/services/user-config'
import * as agent from '~services/agent'
import { ChatError, ErrorCode } from '~utils/errors'
import { DelegatedBot, MessageParams } from '../abstract-bot'
import { ClaudeApiBot } from '../claude-api'
import { ClaudeWebBot } from '../claude-web'
import { OpenRouterBot } from '../openrouter'
import { PoeWebBot } from '../poe'

async function initializeBot() {
  const { claudeMode, ...config } = await getUserConfig()
  if (claudeMode === ClaudeMode.API) {
    if (!config.claudeApiKey) {
      throw new Error('Claude API key missing')
    }
    return new ClaudeApiBot({
      claudeApiKey: config.claudeApiKey,
      claudeApiModel: config.claudeApiModel,
    })
  }
  if (claudeMode === ClaudeMode.Webapp) {
    return new ClaudeWebBot()
  }
  if (claudeMode === ClaudeMode.OpenRouter) {
    if (!config.openrouterApiKey) {
      throw new ChatError('OpenRouter API key not set', ErrorCode.API_KEY_NOT_SET)
    }
    const model = `anthropic/${config.openrouterClaudeModel}`
    return new OpenRouterBot({ apiKey: config.openrouterApiKey, model })
  }
  return new PoeWebBot(config.poeModel)
}

export class ClaudeBot extends DelegatedBot {
  static async initialize() {
    const bot = await initializeBot()
    return new ClaudeBot(bot)
  }

  async sendMessage(params: MessageParams) {
    const { claudeWebAccess } = await getUserConfig()
    if (claudeWebAccess) {
      return agent.execute(params.prompt, (prompt) => this.doSendMessageGenerator({ ...params, prompt }), params.signal)
    }
    return this.doSendMessageGenerator(params)
  }
}
