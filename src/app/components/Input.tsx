import { cx } from '~/utils'
import { FC, HTMLProps } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type InputProps = HTMLProps<HTMLInputElement>

export const Input: FC<InputProps> = (props) => {
  const { className, ...extraProps } = props
  return (
    <input
      className={cx(
        'px-3 py-1.5 outline-none bg-white text-[#303030] dark:bg-gray-700 dark:text-white text-sm block rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6',
        className,
      )}
      {...extraProps}
    />
  )
}

export const Textarea: FC<TextareaAutosizeProps> = (props) => {
  const { className, ...extraProps } = props
  return (
    <TextareaAutosize
      className={cx(
        'px-3 py-1.5 outline-none bg-white text-[#303030] dark:bg-gray-700 dark:text-white text-sm  block rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6',
        className,
      )}
      minRows={2}
      maxRows={5}
      {...extraProps}
    />
  )
}
