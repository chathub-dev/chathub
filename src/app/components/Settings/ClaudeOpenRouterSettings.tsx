import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { OpenRouterClaudeModel, UserConfig } from '~services/user-config'
import { Input } from '../Input'
import Select from '../Select'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ClaudeOpenRouterSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">
          API Key (
          <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline">
            create key here
          </a>
          )
        </p>
        <Input
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.openrouterApiKey}
          onChange={(e) => updateConfigValue({ openrouterApiKey: e.currentTarget.value })}
          type="password"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">{t('Model')}</p>
        <Select
          options={Object.entries(OpenRouterClaudeModel).map(([k, v]) => ({ name: k, value: v }))}
          value={userConfig.openrouterClaudeModel}
          onChange={(v) => updateConfigValue({ openrouterClaudeModel: v })}
        />
      </div>
    </div>
  )
}

export default ClaudeOpenRouterSettings
