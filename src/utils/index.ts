import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 } from 'uuid'
import Browser from 'webextension-polyfill'

export function uuid() {
  return v4()
}

export function getVersion() {
  return Browser.runtime.getManifest().version
}

export function isProduction() {
  return !import.meta.env.DEV
}

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
