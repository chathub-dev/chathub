import { atomWithImmer } from 'jotai-immer'
import { atomFamily } from 'jotai/utils'
import { createBotInstance, BotId } from '~app/bots'
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
