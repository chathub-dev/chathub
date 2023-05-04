import { useAtomValue } from 'jotai'
import useSWR from 'swr'
import { licenseKeyAtom } from '~app/state'
import { loadLicenseKeyValidatedCache, setLicenseKeyValidatedCache, validateLicenseKey } from '~services/premium'

const LICENSE_KEY_VALIDATED_CACHE = loadLicenseKeyValidatedCache()

export function usePremium() {
  const licenseKey = useAtomValue(licenseKeyAtom)

  const activateQuery = useSWR(
    `license:${licenseKey}`,
    async () => {
      if (!licenseKey) {
        return false
      }
      return validateLicenseKey(licenseKey)
    },
    {
      revalidateOnFocus: false,
      fallbackData: LICENSE_KEY_VALIDATED_CACHE,
      onSuccess(data) {
        if (licenseKey) {
          setLicenseKeyValidatedCache(data)
        }
      },
    },
  )

  return {
    activated: activateQuery.data,
    isLoading: activateQuery.isLoading,
  }
}
