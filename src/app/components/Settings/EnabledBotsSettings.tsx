import { FC, useCallback } from 'react'
import { BotId } from '~app/bots'
import { CHATBOTS } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { useTranslation } from 'react-i18next'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const EnabledBotsSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
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

  // カスタムボットと定義済みボットを分離
  const predefinedBots = Object.entries(CHATBOTS).filter(([botId]) => !botId.startsWith('customchat'));
  const customBots = Object.entries(CHATBOTS).filter(([botId]) => botId.startsWith('customchat'));

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      {!userConfig.useCustomChatbotOnly && (

        <div className="p-5 border border-gray-400 shadow-md rounded-lg">
          <p className="font-bold text-md">{t("Predefined Chatbots")}</p>
          <div className="flex flex-row gap-3 flex-wrap">
            {predefinedBots.map(([botId, bot]) => {
              const enabled = userConfig.enabledBots.includes(botId as BotId)
              return (
                <div className="flex flex-row gap-[6px] items-center transition-transform duration-200 hover:scale-105" key={botId}>
                  <input
                    type="checkbox"
                    id={`bot-checkbox-${botId}`}
                    checked={enabled}
                    onChange={(e) => updateStatus(botId as BotId, e.target.checked)}
                    className="transition-colors duration-200"
                  />
                  <label htmlFor={`bot-checkbox-${botId}`} className="font-medium text-sm">
                    {bot.name}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="p-5 border border-gray-400 shadow-md rounded-lg">
        <p className="font-bold text-md">{t("Custom Chatbots")}</p>
        <div className="flex flex-row gap-3 flex-wrap">
          {customBots.map(([botId, bot]) => {
            const enabled = userConfig.enabledBots.includes(botId as BotId)
            // customchat1, customchat2 などの数字部分を取得して-1することでインデックスを得る
            const configIndex = parseInt(botId.replace('customchat', '')) - 1
            const config = userConfig.customApiConfigs?.[configIndex]
            const customName = config?.name
            const botName = customName ? `${bot.name} | ${customName}` : bot.name

            return (
              <div className="flex flex-row gap-[6px] items-center transition-transform duration-200 hover:scale-105" key={botId}>
                <input
                  type="checkbox"
                  id={`bot-checkbox-${botId}`}
                  checked={enabled}
                  onChange={(e) => updateStatus(botId as BotId, e.target.checked)}
                  className="transition-colors duration-200"
                />
                <label htmlFor={`bot-checkbox-${botId}`} className="font-medium text-sm">
                  {botName}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EnabledBotsSettings
