import { ClaudeMode, getUserConfig } from '~/services/user-config'
import { AsyncAbstractBot } from '../abstract-bot'
import { ClaudeApiBot } from '../claude-api'
import { ClaudeWebBot } from '../claude-web'
import { PoeWebBot } from '../poe'

export class ClaudeBot extends AsyncAbstractBot {
  async initializeBot() {
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
    return new PoeWebBot(config.poeModel)
  }
}
