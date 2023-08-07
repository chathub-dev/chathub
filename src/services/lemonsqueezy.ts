import { ofetch } from 'ofetch'
import * as serverApi from '~services/server-api'

async function activateLicense(key: string, instanceName: string) {
  const resp = await serverApi.activateLicense(key, instanceName)
  if (!resp.activated) {
    throw new Error(resp.error)
  }
  return resp.instance.id
}

async function deactivateLicense(key: string, instanceId: string) {
  await ofetch('https://api.lemonsqueezy.com/v1/licenses/deactivate', {
    method: 'POST',
    body: {
      license_key: key,
      instance_id: instanceId,
    },
  })
}

type LicenseKey = {
  valid: boolean
}

async function validateLicense(key: string, instanceId: string): Promise<LicenseKey> {
  const resp = await ofetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    body: {
      license_key: key,
      instance_id: instanceId,
    },
  })
  return { valid: resp.valid }
}

export { activateLicense, deactivateLicense, validateLicense }
