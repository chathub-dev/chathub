import { FC, memo } from 'react'
import dropdownIcon from '~/assets/icons/dropdown.svg'
import { BotId } from '~app/bots'
import SwitchBotDropdown from '../SwitchBotDropdown'
import Tooltip from '../Tooltip'

interface Props {
  botId: BotId
  name: string
  fullName?: string
  onSwitchBot?: (botId: BotId) => void
}

const ChatbotName: FC<Props> = (props) => {
  const node = (
    <Tooltip content={props.fullName || props.name}>
      <span className="font-semibold text-primary-text text-sm cursor-pointer">{props.name}</span>
    </Tooltip>
  )
  if (!props.onSwitchBot) {
    return node
  }
  const triggerNode = (
    <div className="flex flex-row items-center gap-[2px]">
      {node}
      <img src={dropdownIcon} className="w-5 h-5" />
    </div>
  )
  return <SwitchBotDropdown selectedBotId={props.botId} onChange={props.onSwitchBot} triggerNode={triggerNode} />
}

export default memo(ChatbotName)
