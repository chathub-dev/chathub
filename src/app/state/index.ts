import { atomWithImmer } from 'jotai-immer'
import { atomFamily } from 'jotai/utils'
import { BotId, createBot } from '~app/bots'
import { ChatMessageModel } from '~types'

type Param = { botId: BotId; page: string }

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      botId: param.botId,
      bot: createBot(param.botId),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
    })
  },
  (a, b) => a.botId === b.botId && a.page === b.page,
)
