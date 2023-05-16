import { useAtomValue } from 'jotai'
import useSWR from 'swr'
import { licenseKeyAtom } from '~app/state'
import { loadLicenseKeyValidatedCache, setLicenseKeyValidatedCache, validateLicenseKey } from '~services/premium'

const LICENSE_KEY_VALIDATED_CACHE = loadLicenseKeyValidatedCache()

export function usePremium() {
  const licenseKey = useAtomValue(licenseKeyAtom)

  const activateQuery = useSWR<{ valid: boolean }>(
    `license:${licenseKey}`,
    async () => {
      if (!licenseKey) {
        return { valid: false }
      }
      try {
        return await validateLicenseKey(licenseKey)
      } catch (err) {
        console.error(err)
        return { valid: false }
      }
    },
    {
      fallbackData: LICENSE_KEY_VALIDATED_CACHE === undefined ? undefined : { valid: LICENSE_KEY_VALIDATED_CACHE },
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
      onSuccess(data) {
        if (licenseKey) {
          setLicenseKeyValidatedCache(data.valid)
        }
      },
    },
  )

  return {
    activated: activateQuery.data?.valid,
    isLoading: activateQuery.isLoading,
  }
}
