import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { PoeClaudeModel, UserConfig } from '~services/user-config'
import Select from '../Select'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ClaudePoeSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium text-sm">{t('Model')}</p>
      <div className="w-[250px] mb-1">
        <Select
          options={Object.entries(PoeClaudeModel).map(([k, v]) => ({ name: k, value: v }))}
          value={userConfig.poeModel}
          onChange={(v) => updateConfigValue({ poeModel: v })}
        />
      </div>
      {userConfig.poeModel === PoeClaudeModel['claude-2-100k'] && (
        <p className="text-sm mt-1 text-secondary-text">{t('Limited Access')}</p>
      )}
      {userConfig.poeModel === PoeClaudeModel['claude-instant-100k'] && (
        <p className="text-sm mt-1 text-secondary-text">{t('Poe subscribers only')}</p>
      )}
    </div>
  )
}

export default ClaudePoeSettings
