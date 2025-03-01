import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { UserConfig } from '~services/user-config'
import { Input } from '../Input'
import Select from '../Select'
import Blockquote from './Blockquote'

// Perplexityのモデルを定義
export enum PerplexityAPIModel {
  'sonar-reasoning-pro' = 'sonar-reasoning-pro',
  'sonar-reasoning' = 'sonar-reasoning',
  'sonar-pro' = 'sonar-pro',
  'sonar' = 'sonar',
  'llama-3.1-sonar-huge-128k-online' = 'llama-3.1-sonar-huge-128k-online',
  'llama-3.1-sonar-large-128k-online' = 'llama-3.1-sonar-large-128k-online',
  'llama-3.1-sonar-large-128k-chat' = 'llama-3.1-sonar-large-128k-chat',
}

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const PerplexityAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">
          API Key (
          <a
            href="https://docs.perplexity.ai/docs/getting-started"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            how to create key
          </a>
          )
        </p>
        <Input
          className="w-[300px]"
          placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.perplexityApiKey}
          onChange={(e) => updateConfigValue({ perplexityApiKey: e.currentTarget.value })}
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
              options={Object.entries(PerplexityAPIModel).map(([k, v]) => ({ name: k, value: v }))}
              value={Object.values(PerplexityAPIModel).includes(userConfig.perplexityModel as PerplexityAPIModel) ? userConfig.perplexityModel : 'custom'}
              onChange={(v) => updateConfigValue({ perplexityModel: v })}
            />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">{t('Or enter model name manually')}</p>
            <Input
              className='w-full'
              placeholder="Custom model name (optional)"
              value={userConfig.perplexityModel}
              onChange={(e) => updateConfigValue({ perplexityModel: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerplexityAPISettings
