import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomAPIModel, UserConfig } from '~services/user-config'
import { Input, Textarea } from '../Input'
import { DEFAULT_CHATGPT_SYSTEM_MESSAGE } from '~app/consts';
import Select from '../Select'
import Blockquote from './Blockquote'
import Range from '../Range'
import AvatarSelect from './AvatarSelect'
import { avatarMap, type AvatarKey } from './AvatarSelect'


interface Props {
    userConfig: UserConfig
    updateConfigValue: (update: Partial<UserConfig>) => void
}

const CustomAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
    const { t } = useTranslation()

    const formRowClass = "grid grid-cols-[1fr_3fr] items-center gap-4"
    // const formRowClass = "grid grid-cols-[200px_1fr] items-center gap-4"
    const labelClass = "font-medium text-sm text-right"
    const inputContainerClass = "flex-1"

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                {/* Common API Settings */}
                <div className="space-y-3 max-w-[800px]">
                    <div className={formRowClass}>
                        <p className={labelClass}>{t("Common API Key")}</p>
                        <div className={inputContainerClass}>
                            <Input
                                className='w-full'
                                placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={userConfig.customApiKey}
                                onChange={(e) => updateConfigValue({ customApiKey: e.currentTarget.value })}
                                type="password"
                            />
                        </div>

                    </div>
                    <Blockquote className="mt-1 ml-[25%]">{t('Your keys are stored locally')}</Blockquote>

                    <div className={formRowClass}>
                        <p className={labelClass}>{t('Common API Host')}</p>
                        <div className={inputContainerClass}>
                            <Input
                                className='w-full'
                                placeholder="https://api.openai.com"
                                value={userConfig.customApiHost}
                                onChange={(e) => updateConfigValue({ customApiHost: e.currentTarget.value })}
                            />
                        </div>

                    </div>
                    <Blockquote className="mt-1 ml-[25%]">{t('Host works both with /v1 or without /v1')}</Blockquote>


                </div>

                {/* Custom Chatbots */}
                <div className="w-full">
                <div className="flex flex-wrap gap-2">
                    {userConfig.customApiConfigs.map((config, index) => (
                        <div key={index} className="min-w-[600px] flex-1 max-w-[800px] p-3 border border-gray-600 rounded-lg hover:shadow-lg transition-shadow space-y-4">
                            <p className="font-semibold text-base mb-4">{t(`Custom Chatbot No. ${index + 1}`)}</p>

                            <div className="space-y-4">



                                {/* Name Row */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>{t('Custom Chatbot Name')}</p>
                                    <div className="flex gap-1">
                                        <Input
                                            className="flex-1"
                                            value={config.name}
                                            onChange={(e) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].name = e.currentTarget.value
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                            }}
                                        />
                                        <div className="w-[80px]">
                                            <Input
                                                className='w-full'
                                                value={config.shortName}
                                                placeholder="5char"
                                                maxLength={5}
                                                onChange={(e) => {
                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                    updatedConfigs[index].shortName = e.currentTarget.value
                                                    updateConfigValue({ customApiConfigs: updatedConfigs })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>{t('Avatar')}</p>
                                    <AvatarSelect
                                        value={config.avatar}
                                        onChange={(value) => {
                                            const updatedConfigs = [...userConfig.customApiConfigs]
                                            updatedConfigs[index].avatar = value
                                            updateConfigValue({ customApiConfigs: updatedConfigs })
                                        }}
                                    />
                                </div>

                                {/* Model Selection */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>{t('AI Model')}</p>
                                    <div className="grid grid-cols-2 gap-4"> {/* formRowClassを削除し、2列グリッドに変更 */}
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">{t('Choose a model')}</p>
                                            <Select
                                            options={Object.entries(CustomAPIModel).map(([k, v]) => ({ name: k, value: v }))}
                                            value={Object.values(CustomAPIModel).includes(config.model as CustomAPIModel) ? config.model : 'custom'}
                                            onChange={(v) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].model = v
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">{t('Or enter model name manually')}</p>
                                            <Input
                                                className='w-full'
                                                placeholder="Custom model name (optional)"
                                                value={config.model}
                                                onChange={(e) => {
                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                    updatedConfigs[index].model = e.currentTarget.value
                                                    updateConfigValue({ customApiConfigs: updatedConfigs })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* API Host */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>API Host</p>
                                    <div className={inputContainerClass}>
                                        <Input
                                            className='w-full'
                                            placeholder="Leave blank to use API Host (Common)"
                                            value={config.host}
                                            onChange={(e) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].host = e.currentTarget.value
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                            }}
                                        />
                                    </div>
                                </div>


                                {/* API Key */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>API Key</p>
                                    <div className={inputContainerClass}>
                                        <Input
                                            className='w-full'
                                            placeholder="Leave blank to use common API Key"
                                            value={config.apiKey}
                                            onChange={(e) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].apiKey = e.currentTarget.value
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                            }}
                                            type="password"
                                        />
                                    </div>
                                </div>



                                {/* Temperature */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>{t('Temperature')}</p>
                                    <div className={inputContainerClass}>
                                        <Range
                                            value={config.temperature}
                                            onChange={(value) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].temperature = value
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                            }}
                                            min={0}
                                            max={2}
                                            step={0.1}
                                        />
                                    </div>
                                </div>

                                {/* System Message */}
                                <div className={formRowClass}>
                                    <p className={labelClass}>{t('System Message')}</p>
                                    <div className={inputContainerClass}>
                                        <Textarea
                                            className='w-full'
                                            maxRows={5}
                                            value={config.systemMessage || DEFAULT_CHATGPT_SYSTEM_MESSAGE}
                                            onChange={(e) => {
                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                updatedConfigs[index].systemMessage = e.currentTarget.value
                                                updateConfigValue({ customApiConfigs: updatedConfigs })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    )
}

export default CustomAPISettings
