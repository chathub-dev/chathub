import { FC, useMemo } from 'react'
import { BotId } from '~app/bots'
import HistoryContent from './Content'
import Dialog from '../Dialog'
import { CHATBOTS } from '~app/consts'
import { t } from 'i18next'

interface Props {
  botId: BotId
  open: boolean
  onClose: () => void
}

const HistoryDialog: FC<Props> = (props) => {
  const botName = useMemo(() => CHATBOTS[props.botId].name, [props.botId])
  return (
    <Dialog
      title={t('History conversations with', { name: botName })}
      open={props.open}
      onClose={props.onClose}
      className="w-[1000px] min-h-[400px]"
    >
      <HistoryContent botId={props.botId} />
    </Dialog>
  )
}

export default HistoryDialog
