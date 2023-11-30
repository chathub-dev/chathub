import { PerplexityMode, getUserConfig } from '~/services/user-config'
import { AsyncAbstractBot } from '../abstract-bot'
import { PerplexityApiBot } from '../perplexity-api'
import { PerplexityLabsBot } from '../perplexity-web'

export class PerplexityBot extends AsyncAbstractBot {
  async initializeBot() {
    const { perplexityMode, ...config } = await getUserConfig()
    if (perplexityMode === PerplexityMode.API) {
      if (!config.perplexityApiKey) {
        throw new Error('Perplexity API key missing')
      }
      return new PerplexityApiBot(config.perplexityApiKey, 'pplx-70b-online')
    }
    return new PerplexityLabsBot('pplx-70b-online')
  }
}
