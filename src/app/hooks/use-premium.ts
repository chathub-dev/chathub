import { useAtomValue } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { licenseKeyAtom } from '~app/state'
import { loadLicenseKeyValidatedCache, setLicenseKeyValidatedCache, validateLicenseKey } from '~services/premium'

const LICENSE_KEY_VALIDATED_CACHE = loadLicenseKeyValidatedCache()

export function usePremium() {
  const licenseKey = useAtomValue(licenseKeyAtom)

  const activateQuery = useSWRImmutable(
    `license:${licenseKey}`,
    async () => {
      if (!licenseKey) {
        return false
      }
      try {
        return await validateLicenseKey(licenseKey)
      } catch (err) {
        console.error(err)
        return false
      }
    },
    {
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
