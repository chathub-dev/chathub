import { activateLicense, deactivateLicense, validateLicense } from './lemonsqueezy'

export async function validateLicenseKey(key: string) {
  let instanceId = localStorage.getItem(`license_instance_id:${key}`)
  if (!instanceId) {
    instanceId = await activateLicense(key)
    localStorage.setItem(`license_instance_id:${key}`, instanceId)
  }
  return validateLicense(key, instanceId)
}

export async function deactivateLicenseKey(key: string) {
  const instanceId = localStorage.getItem(`license_instance_id:${key}`)
  if (!instanceId) {
    return
  }
  await deactivateLicense(key, instanceId)
  localStorage.removeItem(`license_instance_id:${key}`)
  localStorage.removeItem('license_validated_cache')
}

export function loadLicenseKeyValidatedCache(): boolean | undefined {
  const value = localStorage.getItem('license_validated_cache')
  if (value === null) {
    return undefined
  }
  return JSON.parse(value)
}

export function setLicenseKeyValidatedCache(value: boolean) {
  localStorage.setItem('license_validated_cache', JSON.stringify(value))
}
