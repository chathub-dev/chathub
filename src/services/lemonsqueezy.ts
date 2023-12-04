import { ofetch } from 'ofetch'
import * as serverApi from '~services/server-api'

async function activateLicense(key: string, instanceName: string) {
    const resp = await serverApi.activateLicense(key, instanceName)
    if (!resp.activated) {
        throw new Error(resp.error)
    }
    return resp.instance.id
}

async function deactivateLicense(key: string, instanceId: string) {}

type LicenseKey = {
    valid: boolean
}

async function validateLicense(key: string, instanceId: string): Promise < LicenseKey > {
    return { valid: true }
}

export { activateLicense, deactivateLicense, validateLicense }