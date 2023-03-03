import cx from 'classnames'
import { FC, KeyboardEventHandler, useCallback } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type Props = TextareaAutosizeProps & {
  onValueChange: (value: string) => void
  formref?: React.RefObject<HTMLFormElement>
}

const TextInput: FC<Props> = (props) => {
  const { className, value = '', onValueChange, minRows = 1, ...textareaProps } = props

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        if (e.shiftKey) {
          onValueChange(value + '\n')
        } else {
          props.formref?.current?.requestSubmit()
        }
      }
    },
    [onValueChange, props.formref, value],
  )

  return (
    <TextareaAutosize
      className={cx('resize-none w-full outline-none text-sm text-[#303030] disabled:cursor-wait bg-white', className)}
      onKeyDown={onKeyDown}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      autoComplete="off"
      minRows={minRows}
      maxRows={5}
      {...textareaProps}
    />
  )
}

export default TextInput
