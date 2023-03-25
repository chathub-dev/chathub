import cx from 'classnames'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import { BeatLoader } from 'react-spinners'

interface Props {
  text: string
  className?: string
  color?: 'primary' | 'flat'
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  isLoading?: boolean
  size?: 'small' | 'normal'
  icon?: ReactNode
}

const Button: FC<Props> = (props) => {
  const size = props.size || 'normal'
  return (
    <button
      type={props.type}
      className={cx(
        size === 'normal' ? 'rounded-[60px] text-base font-medium px-8 py-2' : 'rounded-[30px] text-sm px-4 py-1',
        props.color === 'primary' ? 'text-white bg-[#4987FC]' : 'text-[#303030] bg-[#F2F2F2]',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.isLoading ? (
        <BeatLoader size={size === 'normal' ? 10 : 5} color={props.color === 'primary' ? 'white' : '#303030'} />
      ) : (
        <div className="flex flex-row items-center gap-1">
          {props.icon}
          <span>{props.text}</span>
        </div>
      )}
    </button>
  )
}

export default Button
