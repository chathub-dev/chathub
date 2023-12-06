import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiExport, BiImport } from 'react-icons/bi'
import Browser from 'webextension-polyfill'
import Button, { MotionButton } from '~app/components/Button'
import RadioGroup from '~app/components/RadioGroup'
import Select from '~app/components/Select'
import ChatGPTAPISettings from '~app/components/Settings/ChatGPTAPISettings'
import ChatGPTAzureSettings from '~app/components/Settings/ChatGPTAzureSettings'
import ChatGPTOpenRouterSettings from '~app/components/Settings/ChatGPTOpenRouterSettings'
import ChatGPTPoeSettings from '~app/components/Settings/ChatGPTPoeSettings'
import ChatGPWebSettings from '~app/components/Settings/ChatGPTWebSettings'
import ClaudeAPISettings from '~app/components/Settings/ClaudeAPISettings'
import ClaudeOpenRouterSettings from '~app/components/Settings/ClaudeOpenRouterSettings'
import ClaudePoeSettings from '~app/components/Settings/ClaudePoeSettings'
import ClaudeWebappSettings from '~app/components/Settings/ClaudeWebappSettings'
import EnabledBotsSettings from '~app/components/Settings/EnabledBotsSettings'
import KDB from '~app/components/Settings/KDB'
import PerplexityAPISettings from '~app/components/Settings/PerplexityAPISettings'
import { ALL_IN_ONE_PAGE_ID, CHATBOTS } from '~app/consts'
import { exportData, importData } from '~app/utils/export'
import {
  BingConversationStyle,
  ChatGPTMode,
  ClaudeMode,
  PerplexityMode,
  UserConfig,
  getUserConfig,
  updateUserConfig,
} from '~services/user-config'
import { getVersion } from '~utils'
import PagePanel from '../components/Page'

const BING_STYLE_OPTIONS = [
  { name: 'Precise', value: BingConversationStyle.Precise },
  { name: 'Balanced', value: BingConversationStyle.Balanced },
  { name: 'Creative', value: BingConversationStyle.Creative },
]

const ChatBotSettingPanel: FC<PropsWithChildren<{ title: string }>> = (props) => {
  return (
    <div className="flex flex-col gap-1 border border-primary-border px-5 py-4 rounded-lg shadow-sm">
      <p className="font-bold text-md">{props.title}</p>
      {props.children}
    </div>
  )
}

function ExportDataPanel() {
  const { t } = useTranslation()
  return (
    <div>
      <p className="font-bold mb-1 text-lg">{t('Export/Import All Data')}</p>
      <p className="mb-3 opacity-80">{t('Data includes all your settings, chat histories, and local prompts')}</p>
      <div className="flex flex-row gap-3">
        <Button size="small" text={t('Export')} icon={<BiExport />} onClick={exportData} />
        <Button size="small" text={t('Import')} icon={<BiImport />} onClick={importData} />
      </div>
    </div>
  )
}

function ShortcutPanel() {
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          console.debug(c.shortcut)
          setShortcuts(c.shortcut ? [c.shortcut] : [])
        }
      }
    })
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-lg">{t('Shortcut to open this app')}</p>
      <div className="flex flex-row gap-2 items-center">
        {shortcuts.length > 0 && (
          <div className="flex flex-row gap-1">
            {shortcuts.map((s) => (
              <KDB key={s} text={s} />
            ))}
          </div>
        )}
        <Button
          text={t('Change shortcut')}
          size="small"
          onClick={() => Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })}
        />
      </div>
    </div>
  )
}

function SettingPage() {
  const { t } = useTranslation()
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    getUserConfig().then((config) => setUserConfig(config))
  }, [])

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update })
      setDirty(true)
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    let apiHost = userConfig?.openaiApiHost
    if (apiHost) {
      apiHost = apiHost.replace(/\/$/, '')
      if (!apiHost.startsWith('http')) {
        apiHost = 'https://' + apiHost
      }
      // request host permission to prevent CORS issues
      try {
        await Browser.permissions.request({ origins: [apiHost + '/'] })
      } catch (e) {
        console.error(e)
      }
    } else {
      apiHost = undefined
    }
    await updateUserConfig({ ...userConfig!, openaiApiHost: apiHost })
    setDirty(false)
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title={`${t('Settings')} (v${getVersion()})`}>
      <div className="flex flex-row mt-3 mb-5 gap-3">
        <div className="flex flex-col gap-5">
          <ExportDataPanel />
          <ShortcutPanel />
          <div>
            <p className="font-bold mb-2 text-lg">{t('Startup page')}</p>
            <div className="w-[200px]">
              <Select
                options={[
                  { name: 'All-In-One', value: ALL_IN_ONE_PAGE_ID },
                  ...Object.entries(CHATBOTS).map(([botId, bot]) => ({ name: bot.name, value: botId })),
                ]}
                value={userConfig.startupPage}
                onChange={(v) => updateConfigValue({ startupPage: v })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-[700px]">
            <p className="font-bold text-lg">{t('Chatbots')}</p>
            <EnabledBotsSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
          </div>
          <div className="flex flex-col gap-5 w-fit max-w-[700px]">
            <ChatBotSettingPanel title="ChatGPT">
              <RadioGroup
                options={Object.entries(ChatGPTMode).map(([k, v]) => ({ label: `${k} ${t('Mode')}`, value: v }))}
                value={userConfig.chatgptMode}
                onChange={(v) => updateConfigValue({ chatgptMode: v as ChatGPTMode })}
              />
              {userConfig.chatgptMode === ChatGPTMode.API ? (
                <ChatGPTAPISettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : userConfig.chatgptMode === ChatGPTMode.Azure ? (
                <ChatGPTAzureSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : userConfig.chatgptMode === ChatGPTMode.Poe ? (
                <ChatGPTPoeSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : userConfig.chatgptMode === ChatGPTMode.OpenRouter ? (
                <ChatGPTOpenRouterSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : (
                <ChatGPWebSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              )}
            </ChatBotSettingPanel>
            <ChatBotSettingPanel title="Claude">
              <RadioGroup
                options={Object.entries(ClaudeMode).map(([k, v]) => ({ label: `${k} ${t('Mode')}`, value: v }))}
                value={userConfig.claudeMode}
                onChange={(v) => updateConfigValue({ claudeMode: v as ClaudeMode })}
              />
              {userConfig.claudeMode === ClaudeMode.API ? (
                <ClaudeAPISettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : userConfig.claudeMode === ClaudeMode.Webapp ? (
                <ClaudeWebappSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : userConfig.claudeMode === ClaudeMode.OpenRouter ? (
                <ClaudeOpenRouterSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              ) : (
                <ClaudePoeSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              )}
            </ChatBotSettingPanel>
            <ChatBotSettingPanel title="Bing">
              <div className="flex flex-row gap-5 items-center">
                <p className="font-medium text-base">{t('Chat style')}</p>
                <div className="w-[150px]">
                  <Select
                    options={BING_STYLE_OPTIONS}
                    value={userConfig.bingConversationStyle}
                    onChange={(v) => updateConfigValue({ bingConversationStyle: v })}
                    position="top"
                  />
                </div>
              </div>
            </ChatBotSettingPanel>
            <ChatBotSettingPanel title="Perplexity">
              <RadioGroup
                options={Object.entries(PerplexityMode).map(([k, v]) => ({ label: `${k} ${t('Mode')}`, value: v }))}
                value={userConfig.perplexityMode}
                onChange={(v) => updateConfigValue({ perplexityMode: v as PerplexityMode })}
              />
              {userConfig.perplexityMode === PerplexityMode.API && (
                <PerplexityAPISettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
              )}
            </ChatBotSettingPanel>
          </div>
        </div>
        <div>
          {dirty && (
            <MotionButton
              color="primary"
              text={t('Save')}
              className="w-fit fixed bottom-10"
              onClick={save}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </PagePanel>
  )
}

export default SettingPage
