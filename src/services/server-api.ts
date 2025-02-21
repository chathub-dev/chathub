import { ofetch } from 'ofetch'

export async function decodePoeFormkey(html: string): Promise<string> {
  const resp = await ofetch('', {
    method: 'POST',
    body: { html },
  })
  return resp.formkey
}

type ActivateResponse =
  | {
      activated: true
      instance: { id: string }
      meta: { product_id: number }
    }
  | { activated: false; error: string }

export async function activateLicense(key: string, instanceName: string) {
  return ofetch<ActivateResponse>('', {
    method: 'POST',
    body: {
      license_key: key,
      instance_name: instanceName,
    },
  })
}

interface Product {
  price: number
}

export async function fetchPremiumProduct() {
  return ofetch<Product>('')
}

export async function createDiscount() {
  return ofetch<{ code: string; startTime: number }>('', {
    method: 'POST',
  })
}

export interface Discount {
  code: string
  startTime: number
  price: number
  percent: number
}

export interface Campaign {
  description: string
  code: string
  price: number
}

interface PurchaseInfo {
  price: number
  discount?: Discount
  campaign?: Campaign
}

export async function fetchPurchaseInfo() {
  return ofetch<PurchaseInfo>('')
}

export async function checkDiscount(params: { appOpenTimes: number; premiumModalOpenTimes: number }) {
  return ofetch<{ show: boolean; campaign?: Campaign }>('', { params })
}
