import { getBrowser, getOS } from '~app/utils/navigator'
import * as lemonsqueezy from './lemonsqueezy'

interface PremiumActivation {
  licenseKey: string
  instanceId: string
}

function getInstanceName() {
  return `${getOS()} / ${getBrowser()}`
}

export async function activatePremium(licenseKey: string): Promise<PremiumActivation> {
  const instanceId = await lemonsqueezy.activateLicense(licenseKey, getInstanceName())
  const data = { licenseKey, instanceId }
  localStorage.setItem('premium', JSON.stringify(data))
  return data
}

export async function validatePremium() {
  const activation = getPremiumActivation()
  if (!activation) {
    return { valid: false }
  }
  return lemonsqueezy.validateLicense(activation.licenseKey, activation.instanceId)
}

export async function deactivatePremium() {
  const activation = getPremiumActivation()
  if (!activation) {
    return
  }
  await lemonsqueezy.deactivateLicense(activation.licenseKey, activation.instanceId)
  localStorage.removeItem('premium')
}

export function getPremiumActivation(): PremiumActivation | null {
  const data = localStorage.getItem('premium')
  if (data) {
    return JSON.parse(data)
  }
  // Migrate old storage
  const key = localStorage.getItem('licenseKey')
  if (!key) {
    return null
  }
  const licenseKey: string = JSON.parse(key)
  const instanceId = localStorage.getItem(`license_instance_id:${licenseKey}`)
  if (!instanceId) {
    localStorage.removeItem('licenseKey')
    return null
  }
  const d = { licenseKey, instanceId }
  localStorage.setItem('premium', JSON.stringify(d))
  localStorage.removeItem('licenseKey')
  localStorage.removeItem(`license_instance_id:${licenseKey}`)
  return d
}
