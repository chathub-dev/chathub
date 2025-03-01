import { compareVersions } from 'compare-versions'
import Browser from 'webextension-polyfill'
import { getVersion } from '~utils'
// translate


const RELEASE_NOTES = [
  {
    version: '2.3.0',
    notes: ['Add propaganda feature'],
  },
  {
    version: '2.3.3',
    notes: ['Propaganda UI enhancement'],
  },
  {
    version: '2.3.5',
    notes: [
      `releasenote-propaganda`,
      `releasenote-code-expand`,
    ],
  },
  {
    version: '2.3.6',
    notes: [
      `releasenote-claude3-7`
    ],
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
