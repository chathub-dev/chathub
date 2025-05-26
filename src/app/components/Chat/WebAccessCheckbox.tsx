import { Switch } from '@headlessui/react'
import { useSetAtom } from 'jotai'
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePremium } from '~app/hooks/use-premium'
import { showPremiumModalAtom } from '~app/state'
import { requestHostPermission } from '~app/utils/permissions'
import { getUserConfig, updateUserConfig, CustomApiConfig } from '~services/user-config'
import Toggle from '../Toggle'

interface Props {
  index: number
}

const WebAccessCheckbox: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState<boolean>(false) // 初期値は false
  const setPremiumModalOpen = useSetAtom(showPremiumModalAtom)
  const premiumState = usePremium()

  useEffect(() => {
    const fetchWebAccessState = async () => {
      const config = await getUserConfig();
      const customConfig = config.customApiConfigs?.[props.index];
      if (customConfig && typeof customConfig.webAccess === 'boolean') {
        setChecked(customConfig.webAccess);
      } else {
        setChecked(false); // デフォルトは false
      }
    };
    fetchWebAccessState();
  }, [props.index]);

  const onToggle = useCallback(
    async (newValue: boolean) => {
      if (!premiumState.activated && newValue) {
        setPremiumModalOpen('web-access');
        return;
      }
      if (newValue && !(await requestHostPermission('https://*.duckduckgo.com/'))) {
        return;
      }
      
      setChecked(newValue);
      
      const config = await getUserConfig();
      const updatedCustomApiConfigs = [...(config.customApiConfigs || [])];
      const customConfigToUpdate = updatedCustomApiConfigs[props.index];

      if (customConfigToUpdate) {
        const updatedConfig: CustomApiConfig = {
          ...customConfigToUpdate,
          webAccess: newValue,
        };
        updatedCustomApiConfigs[props.index] = updatedConfig;
        updateUserConfig({ customApiConfigs: updatedCustomApiConfigs });
      }
    },
    [premiumState.activated, props.index, setPremiumModalOpen],
  )

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
