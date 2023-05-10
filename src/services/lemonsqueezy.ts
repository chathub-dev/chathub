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
