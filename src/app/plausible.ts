import { isUndefined, omitBy } from 'lodash-es'
import Plausible from 'plausible-tracker'
import { getVersion } from '~utils'

export const plausible = Plausible({
  domain: 'chathub.gg',
  hashMode: true,
  apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
})

export function trackEvent(name: string, props?: { [propName: string]: string | number | boolean | undefined }) {
  try {
    plausible.trackEvent(name, {
      props: {
        version: getVersion(),
        ...omitBy(props || {}, isUndefined),
      },
    })
  } catch (err) {
    console.error('plausible.trackEvent error', err)
  }
}
