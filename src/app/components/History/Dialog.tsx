import { FC, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { BotId } from '~app/bots'
import { CHATBOTS } from '~app/consts'
import { usePremium } from '~app/hooks/use-premium'
import Dialog from '../Dialog'
import HistoryContent from './Content'
import { useTranslation } from 'react-i18next'

interface Props {
  botId: BotId
  open: boolean
  onClose: () => void
}

const HistoryDialog: FC<Props> = (props) => {
  const botName = useMemo(() => CHATBOTS[props.botId].name, [props.botId])
  const { t } = useTranslation()
  const premiumState = usePremium()
  const [keyword, setKeyword] = useState('')

  return (
    <Dialog
      title={`History conversations with ${botName}`}
      open={props.open}
      onClose={props.onClose}
      className="rounded-2xl w-[1000px] min-h-[400px]"
      borderless={premiumState.activated}
    >
      {premiumState.activated && (
        <div className="border-b border-solid border-primary-border pb-[10px] mx-5">
          <div className="rounded-[30px] bg-secondary h-9 flex flex-row items-center px-4">
            <FiSearch size={18} className="mr-[6px] opacity-30" />
            <input
              className="bg-transparent w-full outline-none text-sm"
              placeholder={t('Search')!}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      )}
      <HistoryContent botId={props.botId} keyword={keyword} />
    </Dialog>
  )
}

export default HistoryDialog
