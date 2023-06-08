import * as Sentry from '@sentry/react'
import { ExtraErrorData as ExtraErrorDataIntegration } from '@sentry/integrations'
import { getVersion, isProduction } from '../utils'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  debug: !isProduction(),
  release: getVersion(),
  integrations: [new ExtraErrorDataIntegration({ depth: 3 })],
  sampleRate: 1.0,
})

export { Sentry }
