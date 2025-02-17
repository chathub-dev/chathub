import { DeepSeekMode, getUserConfig } from '~/services/user-config'
import { AsyncAbstractBot } from '../abstract-bot'
import { DeepSeekApiBot } from '../deepseek-api'
import { DeepSeekPpioBot } from '../deepseek-ppio'

export class DeepSeekBot extends AsyncAbstractBot {
  async initializeBot() {
    const { deepseekMode, ...config } = await getUserConfig()
    if (deepseekMode === DeepSeekMode.API) {
      if (!config.deepseekApiKey) {
        throw new Error('DeepSeek API key missing')
      }
      return new DeepSeekApiBot(config)
    } else {
        if (!config.deepseekPpioKey) {
            throw new Error('DeepSeek PPIO API key missing')
          }
        return new DeepSeekPpioBot(config)
    }
  }
}
