import useSWRImmutable from 'swr/immutable'
import { getUserConfig } from '~services/user-config'

export function useUserConfig() {
  const { data } = useSWRImmutable('user-config', getUserConfig, { suspense: true })
  return data
}
