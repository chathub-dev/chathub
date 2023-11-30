import { FC } from 'react'
import { UserConfig } from '~services/user-config'
import { Input } from '../Input'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const PerplexityAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
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
      </div>
    </div>
  )
}

export default PerplexityAPISettings
