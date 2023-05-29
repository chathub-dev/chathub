import { getUserConfig } from '~/services/user-config'
import { AsyncAbstractBot } from '../abstract-bot'
import { PoeWebBot } from '../poe'

export class ClaudeBot extends AsyncAbstractBot {
  async initializeBot() {
    const { poeModel } = await getUserConfig()
    return new PoeWebBot(poeModel)
  }
}
