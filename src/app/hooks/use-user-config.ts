import { useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { modelUpdateNotesAtom } from '~app/state'
import { checkForModelUpdates, getUserConfig } from '~services/user-config'

export function useUserConfig() {
  const setModelUpdateNotes = useSetAtom(modelUpdateNotesAtom)
  const { data } = useSWRImmutable('user-config', async () => {
    const config = await getUserConfig()
    const updates = await checkForModelUpdates(config)
    if (updates.length > 0) {
      setModelUpdateNotes(updates)
    }
    return config
  }, { suspense: true })
  return data
}
