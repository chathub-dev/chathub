import { FC, useCallback } from 'react'
import { BotId } from '~app/bots'
import { CHATBOTS } from '~app/consts'
import { UserConfig } from '~services/user-config'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const EnabledBotsSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const updateStatus = useCallback(
    (botId: BotId, enabled: boolean) => {
      const bots = new Set(userConfig.enabledBots)
      if (enabled) {
        bots.add(botId)
      } else {
        if (bots.size === 1) {
          alert('At least one bot should be enabled')
          return
        } else {
          bots.delete(botId)
        }
      }
      updateConfigValue({ enabledBots: Array.from(bots) })
    },
    [updateConfigValue, userConfig.enabledBots],
  )

  return (
    <div className="flex flex-row gap-3">
      {Object.entries(CHATBOTS).map(([botId, bot]) => {
        const enabled = userConfig.enabledBots.includes(botId as BotId)
        return (
          <div className="flex flex-row gap-[6px]" key={botId}>
            <input
              type="checkbox"
              id={`bot-checkbox-${botId}`}
              checked={enabled}
              onChange={(e) => updateStatus(botId as BotId, e.target.checked)}
            />
            <label htmlFor={`bot-checkbox-${botId}`} className="font-medium text-sm">
              {bot.name}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default EnabledBotsSettings
