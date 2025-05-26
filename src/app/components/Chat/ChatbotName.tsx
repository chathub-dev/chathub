import { FC, memo } from 'react'
import dropdownIcon from '~/assets/icons/dropdown.svg'
import SwitchBotDropdown from '../SwitchBotDropdown'
import Tooltip from '../Tooltip'

interface Props {
  index: number
  name: string
  model: string | undefined
  fullName?: string
  onSwitchBot?: (index: number) => void
}

const ChatbotName: FC<Props> = (props) => {
  const node = (
    <Tooltip content={props.fullName || props.name}>
      <span className="font-semibold text-primary-text text-sm cursor-pointer">{props.name}</span>
    </Tooltip>
  )

  const modelNode = props.model ? (
    <Tooltip content={props.model}>
      <div className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1 ml-1 max-w-[200px]"> {/* max-widthを追加 */}
        <div className="truncate">
        {props.model}
      </div>
      </div>
    </Tooltip>
  ) : null;

  if (!props.onSwitchBot) {
    return (
      <div className="flex items-center">
        {node}
        {modelNode}
      </div>
    )
  }
  const triggerNode = (
    <div className="flex flex-row items-center gap-[2px]">
      {node}
      {modelNode} 
      <img src={dropdownIcon} className="w-5 h-5" />
    </div>
  )
  return <SwitchBotDropdown
    selectedIndex={props.index}
    onChange={(index) => props.onSwitchBot?.(index)}
    triggerNode={triggerNode}
  />
}

export default memo(ChatbotName)
