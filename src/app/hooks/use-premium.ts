import { FetchError } from 'ofetch'
import useSWR from 'swr'
import { getPremiumActivation, validatePremium } from '~services/premium'

export function usePremium() {
  const validationQuery = useSWR<{ valid: true } | { valid: false; error?: string }>(
    'premium-validation',
    async () => {
      try {
        return await validatePremium()
      } catch (err) {
        if (err instanceof FetchError) {
          if (err.status === 404) {
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
      fallbackData: getPremiumActivation() ? { valid: true } : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    },
  )

  return {
    activated: validationQuery.data?.valid,
    isLoading: validationQuery.isLoading,
    error: validationQuery.data?.valid === true ? undefined : validationQuery.data?.error,
  }
}
