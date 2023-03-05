import cx from 'classnames'
import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Button from '../Button'
import TextInput from '../TextInput'

interface Props {
  onSubmit: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  actionButton?: ReactNode | null
  autoFocus?: boolean
}

const ChatMessageInput: FC<Props> = (props) => {
  const [value, setValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!props.disabled && props.autoFocus) {
      inputRef.current?.focus()
    }
  }, [props.autoFocus, props.disabled])

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (value.trim()) {
        props.onSubmit(value)
      }
      setValue('')
    },
    [props, value],
  )

  return (
    <form className={cx('flex flex-row items-center gap-3', props.className)} onSubmit={onFormSubmit} ref={formRef}>
      <TextInput
        ref={inputRef}
        formref={formRef}
        name="input"
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={value}
        onValueChange={setValue}
      />
      {props.actionButton || <Button text="-" className="invisible" />}
    </form>
  )
}

export default memo(ChatMessageInput)
