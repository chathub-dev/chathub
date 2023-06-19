import cx from 'classnames'
import { FC } from 'react'
import layoutFourIcon from '~assets/icons/layout-four.svg'
import layoutThreeIcon from '~assets/icons/layout-three.svg'
import layoutTwoIcon from '~assets/icons/layout-two.svg'

const Item: FC<{ icon: string; active: boolean; onClick: () => void }> = (props) => {
  return (
    <a className={cx(!!props.active && 'bg-[#00000014] dark:bg-[#ffffff26] rounded-[6px]')} onClick={props.onClick}>
      <img src={props.icon} className="w-8 h-8 cursor-pointer" />
    </a>
  )
}

interface Props {
  layout: number
  onChange: (layout: number) => void
}

const LayoutSwitch: FC<Props> = (props) => {
  return (
    <div className="flex flex-row items-center gap-2 bg-primary-background rounded-[15px] px-4">
      <Item icon={layoutTwoIcon} active={props.layout === 2} onClick={() => props.onChange(2)} />
      <Item icon={layoutThreeIcon} active={props.layout === 3} onClick={() => props.onChange(3)} />
      <Item icon={layoutFourIcon} active={props.layout === 4} onClick={() => props.onChange(4)} />
    </div>
  )
}

export default LayoutSwitch
