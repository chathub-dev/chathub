import { FC } from 'react'
import { CHATGPT_API_MODELS } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { Input } from '../Input'
import Select from '../Select'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ChatGPTOpenRouterSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
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
        <p className="font-medium text-sm">API Model</p>
        <Select
          options={CHATGPT_API_MODELS.map((m) => ({ name: m, value: m }))}
          value={userConfig.openrouterOpenAIModel}
          onChange={(v) => updateConfigValue({ openrouterOpenAIModel: v })}
        />
      </div>
    </div>
  )
}

export default ChatGPTOpenRouterSettings
