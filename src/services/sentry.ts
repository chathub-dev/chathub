import * as Sentry from '@sentry/react'
import { getVersion, isProduction } from '../utils'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  debug: !isProduction(),
  release: getVersion(),
  sampleRate: 1.0,
})

export { Sentry }
