import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CHATGPT_API_MODELS, DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { Input, Textarea } from '../Input'
import Select from '../Select'
import Blockquote from './Blockquote'
import Range from '../Range'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ChatGPTAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 max-w-[800px]">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Key</p>
        <Input
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.openaiApiKey}
          onChange={(e) => updateConfigValue({ openaiApiKey: e.currentTarget.value })}
          type="password"
        />
        <Blockquote className="mt-1">{t('Your keys are stored locally')}</Blockquote>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Host</p>
        <Input
          placeholder="https://api.openai.com"
          value={userConfig.openaiApiHost}
          onChange={(e) => updateConfigValue({ openaiApiHost: e.currentTarget.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Model</p>
        <Select
          options={CHATGPT_API_MODELS.map((m) => ({ name: m, value: m }))}
          value={userConfig.chatgptApiModel}
          onChange={(v) => updateConfigValue({ chatgptApiModel: v })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Temperature</p>
        <Range
          value={userConfig.chatgptApiTemperature}
          onChange={(value) => updateConfigValue({ chatgptApiTemperature: value })}
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
          value={userConfig.chatgptApiSystemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE}
          onChange={(e) => updateConfigValue({ chatgptApiSystemMessage: e.currentTarget.value })}
        />
      </div>
    </div>
  )
}

export default ChatGPTAPISettings
