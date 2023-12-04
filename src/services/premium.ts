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
  localStorage.setItem('premium', 'true')
  const instanceId = 'instanceId'
  const data = { licenseKey, instanceId }
  localStorage.setItem('premium', JSON.stringify(data))
  return data
}

export async function validatePremium() {
  return { valid: true }
}

export async function deactivatePremium() {
  const activation = getPremiumActivation()
  if (!activation) {
    return
  }
  localStorage.removeItem('premium')
}

export function getPremiumActivation(): PremiumActivation | null {
  const data = localStorage.getItem('premium')
  if (!data) {
    localStorage.setItem('premium', 'true')
  }
  return null
}
