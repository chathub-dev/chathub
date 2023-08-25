import { getBrowser, getOS } from '~app/utils/navigator'
import { activateLicense, deactivateLicense, validateLicense } from './lemonsqueezy'

function getInstanceName() {
  return `${getOS()} / ${getBrowser()}`
}

export async function validateLicenseKey(key: string) {
  let instanceId = localStorage.getItem(`license_instance_id:${key}`)
  if (!instanceId) {
    instanceId = await activateLicense(key, getInstanceName())
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
}

export function getLicenseInstanceId(key: string) {
  return localStorage.getItem(`license_instance_id:${key}`)
}

export function clearLicenseInstances() {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('license_instance_id:')) {
      localStorage.removeItem(k)
    }
  }
}

export function hasLicenseInstance() {
  return Object.keys(localStorage).some((k) => k.startsWith('license_instance_id:'))
}
