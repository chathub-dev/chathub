import { useAtom } from 'jotai'
import { FetchError } from 'ofetch'
import useSWR from 'swr'
import { licenseKeyAtom } from '~app/state'
import { clearLicenseInstances, getLicenseInstanceId, validateLicenseKey } from '~services/premium'

export function usePremium() {
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom)

  const activateQuery = useSWR<{ valid: boolean }>(
    `license:${licenseKey}`,
    async () => {
      if (!licenseKey) {
        return { valid: false }
      }
      return validateLicenseKey(licenseKey)
    },
    {
      fallbackData: getLicenseInstanceId(licenseKey) ? { valid: true } : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
      onError(err) {
        if (err instanceof FetchError) {
          if (err.status === 404) {
            clearLicenseInstances()
            setLicenseKey('')
          }
        }
      },
    },
  )

  return {
    activated: activateQuery.data?.valid,
    isLoading: activateQuery.isLoading,
  }
}
