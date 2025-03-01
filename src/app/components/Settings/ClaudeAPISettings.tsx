import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ClaudeAPIModel, UserConfig } from '~services/user-config'
import { Input, Textarea } from '../Input'
import Select from '../Select'
import Blockquote from './Blockquote'
import Range from '../Range'
import { DEFAULT_CLAUDE_SYSTEM_MESSAGE } from '~app/consts'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ClaudeAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 max-w-[800px]">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Key</p>
        <Input
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.claudeApiKey}
          onChange={(e) => updateConfigValue({ claudeApiKey: e.currentTarget.value })}
          type="password"
        />
        <Blockquote className="mt-1">{t('Your keys are stored locally')}</Blockquote>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">{t('API Model')}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('Choose a model')}</p>
            <Select
              options={Object.entries(ClaudeAPIModel).map(([k, v]) => ({ name: k, value: v }))}
              value={Object.values(ClaudeAPIModel).includes(userConfig.claudeApiModel as ClaudeAPIModel) ? userConfig.claudeApiModel : 'custom'}
              onChange={(v) => updateConfigValue({ claudeApiModel: v })}
            />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('Or enter model name manually')}</p>
            <Input
              className='w-full'
              placeholder="Custom model name (optional)"
              value={userConfig.claudeApiModel}
              onChange={(e) => updateConfigValue({ claudeApiModel: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{t('Temperature')}</p>
        </div>
        <Range
          value={userConfig.claudeApiTemperature}
          onChange={(value) => updateConfigValue({ claudeApiTemperature: value })}
          min={0}
          max={2}
          step={0.1}
          className="mt-1"
        />
        <Blockquote className="mt-1">
          {t('Higher values make the output more random, while lower values make it more focused and deterministic')}
        </Blockquote>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">System Message</p>
        <Textarea
          maxRows={3}
          value={userConfig.claudeApiSystemMessage || DEFAULT_CLAUDE_SYSTEM_MESSAGE}
          onChange={(e) => updateConfigValue({ claudeApiSystemMessage: e.currentTarget.value })}
        />
      </div>
    </div>
  )
}

export default ClaudeAPISettings
