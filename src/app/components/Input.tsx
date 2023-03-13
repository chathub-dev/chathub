import cx from 'classnames'
import { FC, HTMLProps } from 'react'

type InputProps = HTMLProps<HTMLInputElement>

export const Input: FC<InputProps> = (props) => {
  const { className, ...extraProps } = props
  return (
    <input
      className={cx(
        'px-3 py-1.5 outline-none text-[#303030] text-sm  block rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
        className,
      )}
      {...extraProps}
    />
  )
}
