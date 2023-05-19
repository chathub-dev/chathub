import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { UserConfig } from '~services/user-config'
import Select from '../Select'
import { CHATGPT_WEB_3_5_MODEL } from '~app/consts'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const ChatGPWebSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1 w-[250px]">
      <p className="font-medium text-sm">{t('Model')}</p>
      <Select
        options={[
          { name: 'GPT-3.5', value: CHATGPT_WEB_3_5_MODEL },
          { name: 'GPT-4', value: 'gpt-4' },
          { name: 'GPT-4 Browsing', value: 'gpt-4-browsing' },
        ]}
        value={userConfig.chatgptWebappModelName}
        onChange={(v) => updateConfigValue({ chatgptWebappModelName: v })}
      />
      {userConfig.chatgptWebappModelName.startsWith('gpt-4') && (
        <p className="text-sm mt-1 text-secondary-text">{t('GPT-4 models require ChatGPT Plus')}</p>
      )}
    </div>
  )
}

export default ChatGPWebSettings
