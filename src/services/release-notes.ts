import { compareVersions } from 'compare-versions'
import Browser from 'webextension-polyfill'
import { getVersion } from '~utils'

const RELEASE_NOTES = [
  {
    version: '1.45.0',
    notes: ['Added a separate Gemini Pro bot, can be enabled in the settings'],
  },
]

export async function checkReleaseNotes(): Promise<string[]> {
  const version = getVersion()
  const { lastCheckReleaseNotesVersion } = await Browser.storage.sync.get('lastCheckReleaseNotesVersion')
  Browser.storage.sync.set({ lastCheckReleaseNotesVersion: version })
  if (!lastCheckReleaseNotesVersion) {
    return []
  }
  return RELEASE_NOTES.slice(0, 3)
    .filter(({ version: v }) => compareVersions(v, lastCheckReleaseNotesVersion) > 0)
    .map(({ notes }) => notes)
    .flat()
}
