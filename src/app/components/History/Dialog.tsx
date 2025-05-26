import { cx } from '~/utils'
import { FC, useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import { VscClearAll } from 'react-icons/vsc'
import { usePremium } from '~app/hooks/use-premium'
import { clearHistoryMessages } from '~services/chat-history'
import { getUserConfig } from '~services/user-config'
import Dialog from '../Dialog'
import Tooltip from '../Tooltip'
import HistoryContent from './Content'

const SearchInput: FC<{ disabled: boolean; value: string; onChange: (v: string) => void }> = (props) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl bg-secondary h-9 flex flex-row items-center px-4 grow">
      <FiSearch size={18} className="mr-[6px] opacity-30" />
      <input
        className={cx('bg-transparent w-full outline-none text-sm', props.disabled && 'cursor-not-allowed')}
        placeholder={`${t('Search')} ${props.disabled ? `(${t('Premium Feature')})` : ''}`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
      />
    </div>
  )
}

interface Props {
  index: number
  open: boolean
  onClose: () => void
}

const HistoryDialog: FC<Props> = (props) => {
  const [botName, setBotName] = useState('Custom Bot');
  const { t } = useTranslation()
  const premiumState = usePremium()
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const fetchBotName = async () => {
      const config = await getUserConfig();
      const customConfig = config.customApiConfigs?.[props.index];
      if (customConfig) {
        setBotName(customConfig.name);
      }
    };
    if (props.open) {
      fetchBotName();
    }
  }, [props.index, props.open]);

  const clearAll = useCallback(async () => {
    if (confirm(t('Are you sure you want to clear history messages?')!)) {
      await clearHistoryMessages(props.index)
    }
  }, [props.index, t])

  return (
    <Dialog
      title={`History conversations with ${botName}`}
      open={props.open}
      onClose={props.onClose}
      className="rounded-2xl w-[1000px] min-h-[400px]"
      borderless={true}
    >
      <div className="border-b border-solid border-primary-border pb-[10px] mx-5 flex flex-row items-center gap-4">
        <Tooltip content={t('Clear history messages')}>
          <div className="bg-secondary p-2 rounded-xl cursor-pointer" onClick={clearAll}>
            <VscClearAll size={18} className="opacity-80" />
          </div>
        </Tooltip>
        <SearchInput disabled={!premiumState.activated} value={keyword} onChange={setKeyword} />
      </div>
      <HistoryContent index={props.index} keyword={keyword} />
    </Dialog>
  )
}

export default HistoryDialog
