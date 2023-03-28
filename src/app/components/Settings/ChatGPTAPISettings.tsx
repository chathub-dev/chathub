import { FC, useEffect, useState } from 'react'
import { CHATGPT_API_MODELS } from '~app/consts'
import { getTokenUsage } from '~services/storage'
import { UserConfig } from '~services/user-config'
import { formatAmount, formatDecimal } from '~utils/format'
import { Input } from '../Input'
import Select from '../Select'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ChatGPTAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const [tokenUsed, setTokenUsed] = useState(0)

  useEffect(() => {
    getTokenUsage().then((used) => setTokenUsed(used))
  })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Key</p>
        <Input
          className="w-[300px]"
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={userConfig.openaiApiKey}
          onChange={(e) => updateConfigValue({ openaiApiKey: e.currentTarget.value })}
          type="password"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">API Host</p>
        <Input
          className="w-[300px]"
          placeholder="https://api.openai.com"
          value={userConfig.openaiApiHost}
          onChange={(e) => updateConfigValue({ openaiApiHost: e.currentTarget.value })}
        />
      </div>
      <div className="flex flex-col gap-1 w-[300px]">
        <p className="font-medium text-sm">API Model</p>
        <Select
          options={CHATGPT_API_MODELS.map((m) => ({ name: m, value: m }))}
          value={userConfig.chatgptApiModel}
          onChange={(v) => updateConfigValue({ chatgptApiModel: v })}
        />
      </div>
      <div className="flex flex-col gap-1 w-[300px]">
        <p className="font-medium text-sm">Conversation Style (temperature: {userConfig.chatgptApiTemperature})</p>
        <input
          type="range"
          min={0}
          max={2}
          step={0.2}
          value={userConfig.chatgptApiTemperature}
          onChange={(e) => updateConfigValue({ chatgptApiTemperature: Number(e.currentTarget.value) })}
        />
        <div className="flex flex-row justify-between text-xs">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>
      {tokenUsed > 0 && (
        <p className="text-sm mt-2 italic">
          Usage: {formatDecimal(tokenUsed)} tokens (~{formatAmount((tokenUsed / 1000) * 0.002)})
        </p>
      )}
    </div>
  )
}

export default ChatGPTAPISettings
