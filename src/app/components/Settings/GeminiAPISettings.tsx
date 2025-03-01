import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GeminiAPIModel, UserConfig } from '~services/user-config'
import { Input, Textarea } from '../Input'  // Textareaを追加
import Select from '../Select'
import Blockquote from './Blockquote'
import Range from '../Range';
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts';

// 別名を付ける
const DEFAULT_GEMINI_SYSTEM_MESSAGE = DEFAULT_CHATGPT_SYSTEM_MESSAGE;
interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const GeminiAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 max-w-[800px]">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Key</p>
        <Input
          placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.geminiApiKey}
          onChange={(e) => updateConfigValue({ geminiApiKey: e.currentTarget.value })}
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
              options={Object.entries(GeminiAPIModel).map(([k, v]) => ({ name: k, value: v }))}
              value={Object.values(GeminiAPIModel).includes(userConfig.geminiApiModel as GeminiAPIModel) ? userConfig.geminiApiModel : 'custom'}
              onChange={(v) => updateConfigValue({ geminiApiModel: v })}
            />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('Or enter model name manually')}</p>
            <Input
              className='w-full'
              placeholder="Custom model name (optional)"
              value={userConfig.geminiApiModel}
              onChange={(e) => updateConfigValue({ geminiApiModel: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Temperature</p>
        <Range
          value={userConfig.geminiApiTemperature}
          onChange={(value) => updateConfigValue({ geminiApiTemperature: value })}
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
          value={userConfig.geminiApiSystemMessage || DEFAULT_GEMINI_SYSTEM_MESSAGE}
          onChange={(e) => updateConfigValue({ geminiApiSystemMessage: e.currentTarget.value })}
        />
      </div>
    </div>
  )
}

export default GeminiAPISettings
