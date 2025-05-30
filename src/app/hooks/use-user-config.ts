import useSWRImmutable from 'swr/immutable'
import { getUserConfig } from '~services/user-config'

export function useUserConfig() {
  const { data } = useSWRImmutable('user-config', async () => {
    const config = await getUserConfig()
    return config
  }, { suspense: true })
  return data
}
