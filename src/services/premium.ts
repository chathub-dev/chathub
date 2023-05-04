import { ofetch } from 'ofetch'

export async function validateLicenseKey(key: string) {
  const resp = await ofetch<{ valid: boolean }>('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    body: { license_key: key },
  })
  return resp.valid
}

export function loadLicenseKeyValidatedCache() {
  const value = localStorage.getItem('license_validated_cache')
  if (value === null) {
    return undefined
  }
  return JSON.parse(value)
}

export function setLicenseKeyValidatedCache(value: boolean) {
  localStorage.setItem('license_validated_cache', JSON.stringify(value))
}
