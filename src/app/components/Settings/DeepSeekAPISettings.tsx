import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DeepSeekAPIModel, UserConfig } from '~services/user-config'
import { Input } from '../Input'
import Select from '../Select'
import Blockquote from './Blockquote'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const DeepSeekAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 w-[400px]">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Key (
          <a
            href="https://api-docs.deepseek.com"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            how to create key
          </a>
          )</p>
        <Input
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.deepseekApiKey}
          onChange={(e) => updateConfigValue({ deepseekApiKey: e.currentTarget.value })}
          type="password"
        />
        <Blockquote className="mt-1">{t('Your keys are stored locally')}</Blockquote>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">{t('Model')}</p>
        <Select
          options={Object.entries(DeepSeekAPIModel).map(([k, v]) => ({ name: k, value: v }))}
          value={userConfig.deepseekApiModel}
          onChange={(v) => updateConfigValue({ deepseekApiModel: v })}
        />
      </div>
    </div>
  )
}

export default DeepSeekAPISettings
