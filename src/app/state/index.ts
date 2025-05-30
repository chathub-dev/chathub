import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { createBotInstance } from '~app/bots'
import { getDefaultThemeColor } from '~app/utils/color-scheme'
import { Campaign } from '~services/server-api'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'


type Param = { index: number; page: string }

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      index: param.index,
      bot: createBotInstance(param.index),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: uuid(),
    })
  },
  (a, b) => a.index === b.index && a.page === b.page,
)

export const licenseKeyAtom = atomWithStorage('licenseKey', '', undefined, { getOnInit: true })
export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false, undefined, { getOnInit: true })
export const themeColorAtom = atomWithStorage('themeColor', getDefaultThemeColor())
export const followArcThemeAtom = atomWithStorage('followArcTheme', false)
export const sidePanelBotAtom = atomWithStorage<number>('sidePanelBot', 0)
export const showDiscountModalAtom = atom<false | true | Campaign>(false)
export const releaseNotesAtom = atom<string[]>([])
export const pendingSearchQueryAtom = atom<string | null>(null)
