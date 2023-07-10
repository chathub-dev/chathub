import { arkoseTokenGenerator } from './generator'
import { fetchArkoseToken } from './server'

export async function getArkoseToken() {
  const token = await arkoseTokenGenerator.generate()
  if (token) {
    return token
  }
  return fetchArkoseToken()
}
