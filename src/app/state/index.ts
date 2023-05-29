import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'
import { createBotInstance, BotId } from '~app/bots'
import { getDefaultThemeColor } from '~app/utils/color-scheme'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

type Param = { botId: BotId; page: string }

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
  (a, b) => a.botId === b.botId && a.page === b.page,
)

export const multiPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots', ['chatgpt', 'bing', 'claude', 'bard'])
export const licenseKeyAtom = atomWithStorage('licenseKey', '')
export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false)
export const themeColorAtom = atomWithStorage('themeColor', getDefaultThemeColor())
export const followArcThemeAtom = atomWithStorage('followArcTheme', false)
export const sidePanelBotAtom = atomWithStorage<BotId>('sidePanelBot', 'chatgpt')
