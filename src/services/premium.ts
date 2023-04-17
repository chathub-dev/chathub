import { ofetch } from 'ofetch'

export async function validateLicenseKey(key: string) {
  const resp = await ofetch<{ valid: boolean }>('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    body: { license_key: key },
  })
  return resp.valid
}
