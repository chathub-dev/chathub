import Cookies from 'js-cookie'
import Browser from 'webextension-polyfill'

const csrfToken = Cookies.get('ct0') || ''

await Browser.storage.session.set({ 'twitter-csrf-token': csrfToken })
console.debug('sync twitter csrf token', csrfToken)
