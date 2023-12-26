import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { BotId, createBotInstance } from '~app/bots'
import { FeatureId } from '~app/components/Premium/FeatureList'
import { getDefaultThemeColor } from '~app/utils/color-scheme'
import { Campaign } from '~services/server-api'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

type Param = { botId: BotId }

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      botId: param.botId,
      bot: createBotInstance(param.botId),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: uuid(),
    })
  },
  (a, b) => a.botId === b.botId,
)

export const licenseKeyAtom = atomWithStorage('licenseKey', '', undefined, { getOnInit: true })
export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false, undefined, { getOnInit: true })
export const themeColorAtom = atomWithStorage('themeColor', getDefaultThemeColor())
export const followArcThemeAtom = atomWithStorage('followArcTheme', false)
export const sidePanelBotAtom = atomWithStorage<BotId>('sidePanelBot', 'chatgpt')
export const showDiscountModalAtom = atom<false | true | Campaign>(false)
export const showPremiumModalAtom = atom<false | true | FeatureId>(false)
export const releaseNotesAtom = atom<string[]>([])
