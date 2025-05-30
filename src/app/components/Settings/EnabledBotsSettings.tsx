import { FC, useCallback } from 'react'
import { UserConfig } from '~services/user-config'
import { useTranslation } from 'react-i18next'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const EnabledBotsSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  
  const updateStatus = useCallback(
    (configIndex: number, enabled: boolean) => {
      const updatedConfigs = [...userConfig.customApiConfigs]
      
      if (updatedConfigs[configIndex]) {
        if (!enabled) {
          // 無効にする前に、有効なボットが他にもあるかチェック
          const enabledCount = updatedConfigs.filter(config => config.enabled === true).length
          if (enabledCount <= 1) {
            alert('At least one bot should be enabled')
            return
          }
        }
        updatedConfigs[configIndex].enabled = enabled
        updateConfigValue({ customApiConfigs: updatedConfigs })
      }
    },
    [updateConfigValue, userConfig.customApiConfigs],
  )

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <div className="p-5 border border-gray-400 shadow-md rounded-lg">
        <p className="font-bold text-md">{t("Custom Chatbots")}</p>
        <div className="flex flex-row gap-3 flex-wrap">
          {userConfig.customApiConfigs.map((config, index) => {
            return (
              <div className="flex flex-row gap-[6px] items-center transition-transform duration-200 hover:scale-105" key={index}>
                <input
                  type="checkbox"
                  id={`bot-checkbox-${index}`}
                  checked={config.enabled === true}
                  onChange={(e) => updateStatus(index, e.target.checked)}
                  className="transition-colors duration-200"
                />
                <label htmlFor={`bot-checkbox-${index}`} className="font-medium text-sm">
                  {config.name}
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
