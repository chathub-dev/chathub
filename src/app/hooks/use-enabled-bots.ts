import useSWR from 'swr/immutable'
import { BotId, CHATBOTS } from '~app/bots'
import { getUserConfig } from '~services/user-config'

export function useEnabledBots() {
  const query = useSWR('enabled-bots', async () => {
    const { enabledBots } = await getUserConfig()
    return Object.keys(CHATBOTS)
      .filter((botId) => enabledBots.includes(botId as BotId))
      .map((botId) => {
        const bid = botId as BotId
        return { botId: bid, bot: CHATBOTS[bid] }
      })
  })
  return query.data || []
}
