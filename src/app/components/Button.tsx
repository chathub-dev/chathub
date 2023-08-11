import { cx } from '~/utils'
import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import { BeatLoader } from 'react-spinners'

export interface Props {
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
  const type = props.type || 'button'
  return (
    <button
      type={type}
      className={cx(
        size === 'normal' ? 'rounded-full' : 'rounded-xl',
        size === 'normal' ? 'text-base font-medium px-6 py-[5px]' : 'text-sm px-4 py-1',
        props.color === 'primary' ? 'text-white bg-primary-blue' : 'text-primary-text bg-secondary',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.isLoading ? (
        <BeatLoader size={size === 'normal' ? 10 : 5} color={props.color === 'primary' ? 'white' : '#303030'} />
      ) : (
        <div className="flex flex-row items-center gap-1 min-w-max">
          {props.icon}
          <span>{props.text}</span>
        </div>
      )}
    </button>
  )
}

export default Button
