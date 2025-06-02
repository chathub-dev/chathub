// Removed duplicate import
import { useTranslation } from 'react-i18next'
import { FC, useState, useEffect } from 'react' // useEffect をインポート
import toast from 'react-hot-toast'
import {
    UserConfig,
    CustomApiProvider,
    TemplateType,
    presetApiConfigs,
    MODEL_LIST, // 新しいモデルリストをインポート
} from '~services/user-config'
import { Input, Textarea } from '../Input'
import { CHATGPT_API_MODELS, DEFAULT_CHATGPT_SYSTEM_MESSAGE, DEFAULT_CLAUDE_SYSTEM_MESSAGE } from '~app/consts';
import Select from '../Select' 
import NestedDropdown, { NestedDropdownOption } from '../NestedDropdown'; 
import Blockquote from './Blockquote'
import Range from '../Range'
import Switch from '~app/components/Switch'
import AvatarSelect from './AvatarSelect'
import BotIcon from '../BotIcon'
import { BiPlus, BiTrash, BiHide, BiShow } from 'react-icons/bi'
import Button from '../Button'
import { revalidateEnabledBots } from '~app/hooks/use-enabled-bots'
// テンプレート選択オプション
const TEMPLATE_OPTIONS = [
    { name: '-- テンプレートを選択 --', value: TemplateType.None },
    { name: 'OpenAI GPT-4.1', value: TemplateType.OpenAI },
    { name: 'Anthropic Claude 4 Sonnet', value: TemplateType.Claude },
    { name: 'Google Gemini 2.5 Pro', value: TemplateType.Gemini },
    { name: 'Perplexity', value: TemplateType.Perplexity },
    { name: 'Grok', value: TemplateType.Grok }
]


interface Props {
    userConfig: UserConfig
    updateConfigValue: (update: Partial<UserConfig>) => void
}

// 最大カスタムモデル数（上限を増やす）
const MAX_CUSTOM_MODELS = 50;

const CustomAPISettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
    const { t } = useTranslation()
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
    // 選択されたモデルのプロバイダーを保持するステートを追加
    const [selectedProviderForModel, setSelectedProviderForModel] = useState<Record<number, string | null>>({});

    // 防御的チェック: customApiConfigsが未定義の場合は空配列として扱う
    const customApiConfigs = userConfig.customApiConfigs || [];

    const updateCustomApiConfigs = (newConfigs: UserConfig['customApiConfigs']) => {
        updateConfigValue({ customApiConfigs: newConfigs });
    }

    const formRowClass = "grid grid-cols-[1fr_3fr] items-center gap-4"
    // const formRowClass = "grid grid-cols-[200px_1fr] items-center gap-4"
    const labelClass = "font-medium text-sm text-right"
    const inputContainerClass = "flex-1"

    // モデル選択用のオプションを作成する関数（NestedDropdown用）
    const createModelOptions = (): NestedDropdownOption[] => {
        const options: NestedDropdownOption[] = [];

        Object.keys(MODEL_LIST).forEach(provider => {
            // プロバイダーカテゴリを作成
            const categoryOption: NestedDropdownOption = {
                label: provider, // プロバイダー名をラベルに
                // カテゴリ自体は選択できないように value を設定しないか、disabled: true を設定
                disabled: true, // カテゴリ行を選択不可にする
                children: [], // 子要素（モデル）を格納する配列
            };

            // そのプロバイダーのモデルを子要素として追加
            Object.entries(MODEL_LIST[provider]).forEach(([modelName, modelValue]) => {
                categoryOption.children?.push({
                    label: modelName, // モデル名をラベルに
                    value: modelValue, // モデル値を value に
                });
            });

            // モデルが存在する場合のみカテゴリを追加
            if (categoryOption.children && categoryOption.children.length > 0) {
              options.push(categoryOption);
            }
        });

        return options;
    };

    // セクションの展開/折りたたみを切り替える関数
    const toggleSection = (index: number) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // テンプレートを適用する関数
    const applyTemplate = (templateType: TemplateType, index: number) => {
        if (templateType === TemplateType.None) return;

        const updatedConfigs = [...userConfig.customApiConfigs];
        const config = updatedConfigs[index];

        const presetMap = {
            [TemplateType.OpenAI]: "OpenAI",
            [TemplateType.Claude]: "Anthropic",
            [TemplateType.Gemini]: "Gemini",
            [TemplateType.Perplexity]: "Perplexity",
            [TemplateType.Grok]: "Grok"
        };

        const presetKey = presetMap[templateType];
        if (presetKey && presetApiConfigs[presetKey]) {
            const preset = presetApiConfigs[presetKey];

            // オブジェクト全体を上書きするのではなく、各プロパティを個別に更新
            // モデル名と同じように個別のプロパティを更新することで、onChange と同じ動作にする
            updatedConfigs[index].name = preset.name;
            updatedConfigs[index].shortName = preset.shortName;
            updatedConfigs[index].model = preset.model;
            updatedConfigs[index].host = preset.host;
            updatedConfigs[index].temperature = preset.temperature;
            updatedConfigs[index].systemMessage = preset.systemMessage;
            updatedConfigs[index].avatar = preset.avatar;
            updatedConfigs[index].thinkingMode = preset.thinkingMode;
            updatedConfigs[index].thinkingBudget = preset.thinkingBudget;
            updatedConfigs[index].provider = preset.provider;


        }

        updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
    };

    // 新しいカスタムモデルを追加
    const addNewCustomModel = () => {
        if (customApiConfigs.length >= MAX_CUSTOM_MODELS) {
            alert(t(`Maximum number of custom models (${MAX_CUSTOM_MODELS}) reached.`));
            return;
        }

        const newId = Math.max(...customApiConfigs.map(c => c.id ?? 0), 0) + 1;
        const newConfig = {
            id: newId,
            name: `Custom AI ${newId}`,
            shortName: `Cus${newId}`,
            model: 'gpt-4o',
            host: '',
            temperature: 0.7,
            systemMessage: '',
            avatar: '',
            apiKey: '',
            thinkingMode: false,
            thinkingBudget: 2000,
            provider: CustomApiProvider.OpenAI,
            webAccess: false,
            enabled: true // 新しいモデルはデフォルトで有効
        };

        // カスタムモデル設定のみを更新
        updateConfigValue({
            customApiConfigs: [...customApiConfigs, newConfig]
        });
    };

    // カスタムモデルを削除
    const deleteCustomModel = async (index: number) => {
        if (userConfig.customApiConfigs.length <= 1) {
            alert(t('Cannot delete the last custom model.'));
            return;
        }

        if (!window.confirm(t('Are you sure you want to delete this custom model?'))) {
            return;
        }

        const updatedConfigs = [...userConfig.customApiConfigs];
        // 設定から削除
        updatedConfigs.splice(index, 1);

        // ローカルのReactステートを更新（「Save changes」で永続化）
        updateConfigValue({
            customApiConfigs: updatedConfigs,
        });

        // サイドバーの再検証を実行
        revalidateEnabledBots();

        // 保存を促すトースト
        toast.success(t('Model deleted. Please save changes to persist.'));
    };

    // モデルの有効/無効を切り替え
    const toggleBotEnabledState = (index: number) => {
        const updatedConfigs = [...userConfig.customApiConfigs];
        const currentConfig = updatedConfigs[index];
        const isCurrentlyEnabled = currentConfig.enabled === true;

        if (isCurrentlyEnabled) {
            // 無効にする前に、有効なボットが他にもあるかチェック
            const enabledCount = updatedConfigs.filter(config => config.enabled === true).length;
            if (enabledCount <= 1) {
                alert(t('At least one bot should be enabled'));
                return;
            }
            updatedConfigs[index].enabled = false;
        } else {
            // 有効にする
            updatedConfigs[index].enabled = true;
        }
        
        updateCustomApiConfigs(updatedConfigs);
        revalidateEnabledBots(); // Sidebarの更新をトリガー
    };



    // Removed duplicate useEffect hook

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{t('Custom API Models')}</h2>
                <Button
                    size="small"
                    text={t('Add New Model')}
                    icon={<BiPlus />}
                    onClick={addNewCustomModel}
                    color="primary"
                />
            </div>
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
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-base">{t(`Custom Chatbot No. ${index + 1}`)}</p>
                                        {!config.enabled && (
                                            <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">
                                                {t('Disabled')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {/* テンプレート選択ドロップダウン */}
                                        <div className="mr-2">
                                            <Select
                                                options={TEMPLATE_OPTIONS}
                                                value={TemplateType.None}
                                                onChange={(v) => {
                                                    if (v !== TemplateType.None) {
                                                        applyTemplate(v as TemplateType, index);
                                                    }
                                                }}
                                                position="top"
                                            />
                                        </div>

                                        {/* 表示/非表示ボタン */}
                                        <button
                                            className="p-1 rounded hover:bg-gray-700"
                                            onClick={() => toggleBotEnabledState(index)}
                                            title={config.enabled ? t('Disable') : t('Enable')}
                                        >
                                            {config.enabled ? <BiShow size={16} /> : <BiHide size={16} />}
                                        </button>

                                        {/* 削除ボタン */}
                                        <button
                                            className="p-1 rounded hover:bg-gray-700 text-red-400"
                                            onClick={() => deleteCustomModel(index)}
                                            title={t('Delete')}
                                        >
                                            <BiTrash size={16} />
                                        </button>
                                        <button
                                            className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                            onClick={() => {
                                                if (index > 0) {
                                                    const updatedConfigs = [...customApiConfigs];
                                                    // 設定を入れ替え
                                                    [updatedConfigs[index - 1], updatedConfigs[index]] = [updatedConfigs[index], updatedConfigs[index - 1]];
                                                    
                                                    // カスタムAPI設定のみを更新
                                                    updateCustomApiConfigs(updatedConfigs);
                                                }
                                            }}
                                            disabled={index === 0}
                                            title={t('Move up')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                                            </svg>
                                        </button>
                                        <button
                                            className={`p-1 rounded ${index === customApiConfigs.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                            onClick={() => {
                                                if (index < customApiConfigs.length - 1) {
                                                    const updatedConfigs = [...customApiConfigs];
                                                    // 設定を入れ替え
                                                    [updatedConfigs[index], updatedConfigs[index + 1]] = [updatedConfigs[index + 1], updatedConfigs[index]];
                                                    
                                                    // カスタムAPI設定のみを更新
                                                    updateCustomApiConfigs(updatedConfigs);
                                                }
                                            }}
                                            disabled={index === userConfig.customApiConfigs.length - 1}
                                            title={t('Move down')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* 基本設定セクション（常に表示） */}
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
                                                        updatedConfigs[index].name = e.currentTarget.value;
                                                        updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
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
                                                            updatedConfigs[index].shortName = e.currentTarget.value;
                                                            updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Avatar */}
                                        <div className={formRowClass}>
                                            <p className={labelClass}>{t('Avatar')}</p>
                                            <div className="flex flex-col gap-2">
                                                <AvatarSelect
                                                    value={config.avatar}
                                                    onChange={(value) => {
                                                        const updatedConfigs = [...userConfig.customApiConfigs]
                                                        updatedConfigs[index].avatar = value;
                                                        updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Model Selection */}
                                        <div className={formRowClass}>
                                            <p className={labelClass}>{t('AI Model')}</p>
                                            {/* Changed grid to flex for horizontal layout, align items to end */}
                                            <div className="flex items-end gap-4">
                                                {/* Dropdown Section - Wrapped in flex-1 div */}
                                                <div className="flex-1">
                                                    <div>
                                                        <p className="text-sm text-gray-300 mb-1">{t('Choose model')}</p>
                                                        <div className="relative">
                                                            {/* NestedDropdown コンポーネントを使用 */}
                                                            <NestedDropdown
                                                                options={createModelOptions()}
                                                                value={config.model}
                                                                onChange={(v) => {
                                                                    // カテゴリ行や無効な値が選択された場合は無視
                                                                    if (!v || v.startsWith('header-')) {
                                                                      return;
                                                                    }
                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                    updatedConfigs[index].model = v;
                                                                    updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                }}
                                                                placeholder={t('Select a model')}
                                                                showModelId={true} // モデルIDを表示する設定
                                                            />
                                                        </div>
                                                    </div>
                                                </div> {/* End Dropdown Section Wrapper */}

                                                {/* Manual Input Section - Wrapped in flex-1 div */}
                                                <div className="flex-1">
                                                    {/* Removed mt-2 */}
                                                    <div> {/* Wrap label and input */}
                                                        <p className="text-sm text-gray-300 mb-1">{t('Or enter model name manually')}</p>
                                                        <Input
                                                            className='w-full'
                                                            placeholder="Custom model name"
                                                            value={config.model}
                                                            onChange={(e) => {
                                                                const updatedConfigs = [...userConfig.customApiConfigs]
                                                                updatedConfigs[index].model = e.currentTarget.value;
                                                                updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                            }}
                                                        />
                                                    </div> {/* End label and input wrapper */}
                                                </div> {/* End Manual Input Section Wrapper */}
                                            </div>
                                        </div>

                                        {/* 詳細設定セクション（展開可能） */}
                                        <div className="border-t pt-3">
                                            <button
                                                className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                                onClick={() => toggleSection(index)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    className={`transition-transform ${expandedSections[index] ? 'rotate-90' : ''}`}
                                                >
                                                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                                {t('Advanced Settings')}
                                            </button>

                                            {expandedSections[index] && (
                                                <div className="mt-3 space-y-4">
                                                    {/* Provider Selection */}
                                                    <div className={formRowClass}>
                                                        <p className={labelClass}>{t('API Provider')}</p>
                                                        <div className="flex-1">
                                                            <Select
                                                                options={[
                                                                    { name: 'OpenAI Compatible', value: CustomApiProvider.OpenAI },
                                                                    { name: 'Anthropic Claude API', value: CustomApiProvider.Anthropic },
                                                                    { name: 'AWS Bedrock (Anthropic)', value: CustomApiProvider.Bedrock },
                                                                    { name: 'Google Gemini API', value: CustomApiProvider.Google },
                                                                    { name: 'Perplexity API', value: CustomApiProvider.Perplexity }
                                                                ]}
                                                                value={config.provider || CustomApiProvider.OpenAI}
                                                                onChange={(v) => {
                                                                    console.log(`Provider changed for index ${index}: Selected value (v) = ${v}`); // Debug log
                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                    updatedConfigs[index].provider = v as CustomApiProvider;
                                                                    console.log(`Provider changed for index ${index}: updatedConfigs[${index}].provider = ${updatedConfigs[index].provider}`); // Debug log remains
                                                                    updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {config.provider === CustomApiProvider.Anthropic && (
                                                        <div className={formRowClass}>
                                                            <p className={labelClass}>{t('Anthropic Auth Header')}</p>
                                                            <div className="flex-1">
                                                                <Select
                                                                    options={[
                                                                        { name: 'x-api-key (Default)', value: 'false' },
                                                                        { name: 'Authorization', value: 'true' }
                                                                    ]}
                                                                    value={config.isAnthropicUsingAuthorizationHeader ? 'true' : 'false'}
                                                                    onChange={(v) => {
                                                                        const updatedConfigs = [...userConfig.customApiConfigs]
                                                                        updatedConfigs[index].isAnthropicUsingAuthorizationHeader = v === 'true';
                                                                        updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Removed redundant provider display and closing tag */}

                                                    {/* API Host */}
                                                    <div className={formRowClass}>
                                                        <p className={labelClass}>API Host</p>
                                                        <div className={inputContainerClass}>
                                                            <Input
                                                                className='w-full'
                                                                placeholder={config.provider === CustomApiProvider.Google ? t("Not applicable for Google Gemini") : "Leave blank to use API Host (Common)"}
                                                                value={config.host}
                                                                onChange={(e) => {
                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                    updatedConfigs[index].host = e.currentTarget.value;
                                                                    updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                }}
                                                                disabled={config.provider === CustomApiProvider.Google} // Disable if provider is Google
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
                                                                    updatedConfigs[index].apiKey = e.currentTarget.value;
                                                                    updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                }}
                                                                type="password"
                                                            />
                                                        </div>
                                                    </div>

                                                    {(() => {
                                                        const isAnthropicProvider = config.provider === CustomApiProvider.Anthropic ||
                                                                                  config.provider === CustomApiProvider.Bedrock ||
                                                                                  config.provider === CustomApiProvider.Anthropic_CustomAuth;

                                                        return (
                                                            <>
                                                                {isAnthropicProvider && (
                                                                    <div className={formRowClass}>
                                                                        <p className={labelClass}>{t('Thinking Mode')}</p>
                                                                        <div className="flex items-center gap-3">
                                                                            <Switch
                                                                                checked={config.thinkingMode ?? false}
                                                                                onChange={(enabled) => {
                                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                                    updatedConfigs[index].thinkingMode = enabled;
                                                                                    updateCustomApiConfigs(updatedConfigs);
                                                                                }}
                                                                            />
                                                                            <span className="text-sm font-medium">
                                                                                {config.thinkingMode ? t('Enabled') : t('hidden')}
                                                                            </span>
                                                                            <div className="relative group">
                                                                                <span className="cursor-help text-gray-400">ⓘ</span>
                                                                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg w-64">
                                                                                    {t('Currently only supported by Claude(Bedrock)')}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {(isAnthropicProvider && config.thinkingMode) ? (
                                                                    <div className={formRowClass}>
                                                                        <p className={labelClass}>{t('Thinking Budget')}</p>
                                                                        <div className={inputContainerClass}>
                                                                            <Range
                                                                                value={config.thinkingBudget ?? 2000}
                                                                                onChange={(value) => {
                                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                                    updatedConfigs[index].thinkingBudget = value;
                                                                                    updateCustomApiConfigs(updatedConfigs);
                                                                                }}
                                                                                min={2000}
                                                                                max={32000}
                                                                                step={1000}
                                                                            />
                                                                            <div className="text-sm text-right mt-1">{config.thinkingBudget} tokens</div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    // Show Temperature if not Anthropic provider OR if Anthropic provider and Thinking Mode is off
                                                                    <div className={formRowClass}>
                                                                        <p className={labelClass}>{t('Temperature')}</p>
                                                                        <div className={inputContainerClass}>
                                                                            <Range
                                                                                value={config.temperature}
                                                                                onChange={(value) => {
                                                                                    const updatedConfigs = [...userConfig.customApiConfigs]
                                                                                    updatedConfigs[index].temperature = value;
                                                                                    updateCustomApiConfigs(updatedConfigs);
                                                                                }}
                                                                                min={0}
                                                                                max={2}
                                                                                step={0.1}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}

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
                                                                    updatedConfigs[index].systemMessage = e.currentTarget.value;
                                                                    updateCustomApiConfigs(updatedConfigs); // ヘルパー関数を使用
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div> {/* Close space-y-4 div (line 363) */}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            size="small"
                            text={t('Add New Model')}
                            icon={<BiPlus />}
                            onClick={addNewCustomModel}
                            color="primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAPISettings;
