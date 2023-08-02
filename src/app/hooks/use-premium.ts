import { useAtom } from 'jotai'
import { FetchError } from 'ofetch'
import useSWR from 'swr'
import { licenseKeyAtom } from '~app/state'
import { clearLicenseInstances, getLicenseInstanceId, validateLicenseKey } from '~services/premium'

export function usePremium() {
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom)

  const activateQuery = useSWR<{ valid: true } | { valid: false; error?: string }>(
    `license:${licenseKey}`,
    async () => {
      if (!licenseKey) {
        return { valid: false }
      }
      try {
        return await validateLicenseKey(licenseKey)
      } catch (err) {
        if (err instanceof FetchError) {
          if (err.status === 404) {
            clearLicenseInstances()
            setLicenseKey('')
            return { valid: false }
          }
          if (err.status === 400) {
            return { valid: false, error: err.data.error }
          }
        }
        throw err
      }
    },
    {
      fallbackData: getLicenseInstanceId(licenseKey) ? { valid: true } : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    },
  )

  return {
    activated: activateQuery.data?.valid,
    isLoading: activateQuery.isLoading,
    error: activateQuery.data?.valid === true ? undefined : activateQuery.data?.error,
  }
}
