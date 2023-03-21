import { FC, useMemo } from 'react'
import { BotId } from '~app/bots'
import HistoryContent from './Content'
import Dialog from '../Dialog'
import { CHATBOTS } from '~app/consts'

interface Props {
  botId: BotId
  open: boolean
  onClose: () => void
}

const HistoryDialog: FC<Props> = (props) => {
  const botName = useMemo(() => CHATBOTS[props.botId].name, [props.botId])
  return (
    <Dialog
      title={`History conversations with ${botName}`}
      open={props.open}
      onClose={props.onClose}
      className="max-w-[1000px] min-w-[600px] min-h-[400px]"
    >
      <HistoryContent botId={props.botId} />
    </Dialog>
  )
}

export default HistoryDialog
