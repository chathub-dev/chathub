import Plausible from 'plausible-tracker'

export const plausible = Plausible({
  domain: 'chathub.gg',
  hashMode: true,
  apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
})

export function trackEvent(name: string, props?: { [propName: string]: string | number | boolean }) {
  try {
    plausible.trackEvent(name, { props })
  } catch (err) {
    console.error('plausible.trackEvent error', err)
  }
}
