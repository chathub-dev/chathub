import { FC } from 'react'
import { UserConfig } from '~services/user-config'
import { Input } from '../Input'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ChatGPTAzureSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Azure Instance Name</p>
        <Input
          className="w-[300px]"
          value={userConfig.azureOpenAIApiInstanceName}
          onChange={(e) => updateConfigValue({ azureOpenAIApiInstanceName: e.currentTarget.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Azure API Key</p>
        <Input
          className="w-[300px]"
          value={userConfig.azureOpenAIApiKey}
          onChange={(e) => updateConfigValue({ azureOpenAIApiKey: e.currentTarget.value })}
          type="password"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Azure Deployment Name</p>
        <Input
          className="w-[300px]"
          value={userConfig.azureOpenAIApiDeploymentName}
          onChange={(e) => updateConfigValue({ azureOpenAIApiDeploymentName: e.currentTarget.value })}
        />
      </div>
    </div>
  )
}

export default ChatGPTAzureSettings
