import { ofetch } from 'ofetch'

async function activateLicense(key: string) {
  const resp = await ofetch<{ activated: true; instance: { id: string } } | { activated: false; error: string }>(
    'https://api.lemonsqueezy.com/v1/licenses/activate',
    {
      method: 'POST',
      body: {
        license_key: key,
        instance_name: 'Instance',
      },
    },
  )
  if (!resp.activated) {
    throw new Error(resp.error)
  }
  return resp.instance.id
}

async function validateLicense(key: string, instanceId: string) {
  const resp = await ofetch<{ valid: boolean }>('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    body: {
      license_key: key,
      instance_id: instanceId,
    },
  })
  return resp.valid
}

export async function validateLicenseKey(key: string) {
  let instanceId = localStorage.getItem(`license_instance_id:${key}`)
  if (!instanceId) {
    instanceId = await activateLicense(key)
    localStorage.setItem(`license_instance_id:${key}`, instanceId)
  }
  return validateLicense(key, instanceId)
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
