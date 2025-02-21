import { Switch } from '@headlessui/react'
import { useSetAtom } from 'jotai'
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BotId } from '~app/bots'
import { usePremium } from '~app/hooks/use-premium'
import { showPremiumModalAtom } from '~app/state'
import { requestHostPermission } from '~app/utils/permissions'
import { getUserConfig, updateUserConfig } from '~services/user-config'
import Toggle from '../Toggle'

interface Props {
  botId: BotId
}

const WebAccessCheckbox: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState<boolean | null>(null)
  const setPremiumModalOpen = useSetAtom(showPremiumModalAtom)
  const premiumState = usePremium()

  const configKey = useMemo(() => {
    if (props.botId === 'chatgpt') {
      return 'chatgptWebAccess'
    }
    if (props.botId === 'claude') {
      return 'claudeWebAccess'
    }
  }, [props.botId])

  useEffect(() => {
    if (!configKey) {
      return
    }
    if (premiumState.activated === false) {
      setChecked(false)
      updateUserConfig({ [configKey]: false })
    } else if (premiumState.activated) {
      getUserConfig().then((config) => setChecked(config[configKey]))
    }
  }, [configKey, premiumState.activated])

  const onToggle = useCallback(
    async (newValue: boolean) => {
      if (!premiumState.activated && newValue) {
        setPremiumModalOpen('web-access')
        return
      }
      if (!(await requestHostPermission('https://*.duckduckgo.com/'))) {
        return
      }
      setChecked(newValue)
      if (configKey) {
        updateUserConfig({ [configKey]: newValue })
      }
    },
    [configKey, premiumState.activated, props.botId, setPremiumModalOpen],
  )

  if (checked === null) {
    return null
  }

  return (
    <div className="flex flex-row items-center gap-2 shrink-0 cursor-pointer group">
      <Switch.Group>
        <div className="flex flex-row items-center gap-2">
          <Toggle enabled={checked} onChange={onToggle} />
          <Switch.Label className="text-[13px] whitespace-nowrap text-light-text font-medium select-none">
            {t('Web Access')}
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  )
}

export default memo(WebAccessCheckbox)
